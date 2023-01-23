# -*- coding: utf-8 -*-
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Optional, Union
from lncrawl.bots.web2.flask_api import datetools
from lncrawl.core.app import App
from lncrawl.core.crawler import Crawler
import logging
from urllib.parse import urlparse, quote_plus
from slugify import slugify
from pathlib import Path
import json
from lncrawl.core.sources import prepare_crawler
import threading

logger = logging.getLogger(__name__)
from .. import lib
from .. import database
from .. import read_novel_info
from .. import utils


class JobHandler:
    original_query: str = ""
    selected_novel = None
    is_busy = False
    search_results: Optional[dict[str, Union[int, str, List]]] = None
    crashed: bool = False
    last_action: str = "Created job"
    metadata_downloaded = False

    def __init__(self, job_id: str):
        self.app = App()
        self.app.output_formats = {"json": True, "epub":True, "pdf":True}
        self.job_id = job_id
        self.last_activity = datetime.now()
        self.executor = ThreadPoolExecutor(max_workers=10, thread_name_prefix=job_id)

        # Self destruct after 10 hour
        threading.Timer(36000, self.destroy).start()


    # -----------------------------------------------------------------------------
    def crash(self, reason: str):
        print(f"{'-'*26}\n{reason}\n{'-'*26}")
        self.crashed = True
        self.set_last_action(reason)
        logger.exception(reason)
        self.destroy()
        return reason

    def destroy(self):
        self.executor.submit(self.destroy_sync)

    def destroy_sync(self):
        try:
            success = not self.crashed
            database.jobs[self.job_id] = FinishedJob(
                success,
                self.last_action,
                self.last_activity,
                self.original_query,
                self.job_id,
            )
            try:
                if self.app.good_file_name and self.app.crawler.home_url:
                    database.jobs[self.job_id].url = (
                        quote_plus(self.app.good_file_name)
                        + "/"
                        + quote_plus(
                            slugify(urlparse(self.app.crawler.home_url).netloc)
                        )
                    )
            except Exception as e:
                print(f"{'-'*26}\n{e}\n{'-'*26}")

            self.app.destroy()
            self.executor.shutdown(wait=False)
            if success:
                self._delete_snapshot()
        except Exception as e:
            print(f"{'-'*26}\nError while destroying: {e}\n{'-'*26}")
            logger.exception(f"While destroying JobHandler : {e}")
        finally:
            logger.info("Session destroyed: %s", self.job_id)

    # -----------------------------------------------------------------------------

    def set_last_action(self, action: str):
        print("starting action : ", action)
        self.last_action = action
        self.last_activity = datetime.now()

    sources_to_search = 0
    chapters_to_download = 0
    images_to_download = 0

    def get_status(self):
        if not self.is_busy:
            return "No current task"

        elif self.last_action == "Downloading":
            if self.app.downloading_images:
                if not self.images_to_download:
                    self.images_to_download = (
                        sum(
                            [
                                len(chapter.get("images", {}))
                                for chapter in self.app.chapters
                            ]
                        )
                        + 2
                    )  # +1 for the cover and +1 idk why
                return f"Downloading images ({self.app.progress}/{self.images_to_download})"

            else:
                if not self.chapters_to_download:
                    self.chapters_to_download = len(self.app.chapters)
                return f"Downloading chapters ({self.app.progress}/{self.chapters_to_download})"

        elif self.last_action == "Searching":
            if not self.sources_to_search:
                self.sources_to_search = len(self.app.crawler_links)
            return f"Searching ({self.app.progress}/{self.sources_to_search})"

        else:
            return self.last_action

    # -----------------------------------------------------------------------------
    def get_list_of_novel(self, query: str) -> None:
        self.original_query = query
        self.is_busy = True
        self.executor.submit(self._get_list_of_novel, query)

    def _get_list_of_novel(self, query: str):
        if len(query) < 4:
            self.is_busy = False
            return

        self.app.user_input = query
        try:
            self.set_last_action("Preparing crawler")
            self.app.prepare_search()
        except Exception as e:
            return self.crash(f"{'-'*26}\nError while preparing crawler: {e}\n{'-'*26}")

        try:
            self.set_last_action("Searching")
            self.app.search_novel()
        except Exception as e:
            return self.crash(f"Fail to search novel : {e}")

        self.search_results = {
            "found": len(self.app.search_results),
            "content": [
                {
                    "id": i,
                    "title": item["title"],
                    "sources": len(item["novels"]),
                }
                for i, item in enumerate(self.app.search_results)
            ],
            "query": query,
        }
        self.set_last_action("Creating snapshot")
        self._create_snapshot()
        self.is_busy = False

    # -----------------------------------------------------------------------------
    def select_novel(self, novel_id: int) -> None:
        self.selected_novel = self.app.search_results[novel_id]

    def get_list_of_sources(self):
        self.set_last_action("Source selection")

        assert self.selected_novel, "No novel selected"

        return {
            "novel": self.selected_novel["title"],
            "content": [
                {
                    "url": item["url"],
                    "info": item["info"] if "info" in item else "",
                }
                for item in self.selected_novel["novels"]
            ],
        }

    def select_source(self, source_id: int):
        self.is_busy = True

        assert self.selected_novel, "No novel selected"

        self.set_last_action(f"Selected {self.selected_novel['novels'][source_id]}")
        try:
            self.app.crawler = prepare_crawler(self.selected_novel["novels"][source_id]["url"])
        except Exception as e:
            return self.crash(f"Fail to init crawler : {e}")

        self.set_last_action("Getting information about your novel...")
        self.executor.submit(self.download_novel_info)

    # -----------------------------------------------------------------------------

    def prepare_direct_download(self, url: str):
        self.original_query = url
        self.is_busy = True
        try:
            self.app.crawler = prepare_crawler(url)
        except Exception as e:
            return self.crash(f"Fail to init crawler : {e}")
        self.executor.submit(self.download_novel_info)

    # -----------------------------------------------------------------------------
    def _select_range(self, start=0, stop=None):
        self.set_last_action("Set download range")
        self.app.chapters = self.app.crawler.chapters[start:stop]  # type: ignore

    def download_novel_info(self):
        self.is_busy = True
        self.set_last_action("Getting novel information...")

        try:
            self.app.get_novel_info()
        except Exception as ex:
            return self.crash(f"Failed to get novel info : {ex}")

        self.source_slug = slugify(urlparse(self.app.crawler.home_url).netloc)  # type: ignore
        self.novel_slug = self.app.good_file_name
        output_path = lib.LIGHTNOVEL_FOLDER / self.novel_slug / self.source_slug
        self.app.output_path = str(output_path)
        if not output_path.exists():
            output_path.mkdir(parents=True)

        self.is_busy = False
        self.metadata_downloaded = True

    def start_download(self, update_website=True, destroy_after=True):
        self.is_busy = True
        self._select_range()
        self.executor.submit(self._start_download, update_website, destroy_after)

    def _start_download(self, update_website=True, destroy_after=True):
        self.is_busy = True
        self.app.pack_by_volume = False

        try:
            assert isinstance(self.app.crawler, Crawler)
            self.set_last_action("Downloading")
            self.app.start_download()

            folder = Path(self.app.output_path)
            # If the ebook is too big, don't bind it as it cran crash the app.
            # TODO : split the ebook 
            if folder.stat().st_size < lib.MAX_EBOOK_SIZE:
                self.set_last_action("Binding books...")
                self.app.bind_books()
                
            self.set_last_action("Finished downloading")
            if update_website:
                self.set_last_action("Updating website")
                self._update_website()

        except Exception as ex:
            return self.crash(f"Download failed : {ex}")

        if destroy_after:
            self.set_last_action("Successfully downloaded, destroying session")
            self.destroy()

        self.is_busy = False

    def _update_website(self):
        try:
            self.set_last_action("reading metadata")
            novel_info = read_novel_info.get_novel_info(
                Path(self.app.output_path).parent
            )
            for source in novel_info.sources:
                if source.slug == self.source_slug:
                    source.last_update_date = datetools.utc_str_date()
                    meta_path = source.path / "meta.json"
                    with open(str(meta_path), "r", encoding="utf-8") as f:
                        metadata = json.load(f)

                    metadata["last_update_date"] = source.last_update_date
                    with open(str(meta_path), "w", encoding="utf-8") as f:
                        json.dump(metadata, f, indent=4)

            self.set_last_action("Adding novel to database")
            utils.add_novel_to_database(novel_info)
        except Exception as ex:
            return self.crash(f"Failed to update website : {ex}")

    # -----------------------------------------------------------------------------
    def _create_snapshot(self):
        """
        Create a JobSnapshot with its search result in jobs_snapshots to be able to restore it if the download fail to quickly
        allow a retry with another source without having to search the same query again
        """
        try:
            database.jobs_snapshots[self.job_id] = job = JobHandler(self.job_id)
            job.search_results = self.search_results
            job.original_query = self.original_query
            job.app.search_results = self.app.search_results
            job.last_action = self.last_action
        except Exception as e:
            print("Failed to create snapshot : ", e)


    def _delete_snapshot(self):
        """
        Delete the snapshot
        """
        if self.job_id in database.jobs_snapshots:
            del database.jobs_snapshots[self.job_id]


class FinishedJob:
    """
    Represent a successfully downloaded novel, or a failed download.
    Replace JobHandler in lib.jobs when JobHandler is destroyed
    """

    is_busy = False
    last_action = "Finished"
    url = ""

    def __init__(
        self,
        success: bool,
        message: str,
        end_date: datetime,
        original_query: str,
        job_id: str,
    ):
        print(f"FinishedJob: {success}, {message}, {end_date}")
        self.original_query = original_query
        self.success = success
        self.message = message
        self.end_date = end_date
        self.job_id = job_id

    def get_status(self):
        return self.message

    def destroy(self):
        pass

    def restore_snapshot(self):
        """
        Restore the job from the snapshot
        """
        if self.snapshot_exists():
            snapshot = database.jobs_snapshots[self.job_id]

            database.jobs[self.job_id] = snapshot
            snapshot._delete_snapshot()
            snapshot._create_snapshot()

            return database.jobs_snapshots[self.job_id]

        else:
            return None

    def snapshot_exists(self):
        return self.job_id in database.jobs_snapshots

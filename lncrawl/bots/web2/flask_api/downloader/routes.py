from ..flaskapp import app
from flask import request
from .. import database
from .. import lib
from .Job import JobHandler, FinishedJob

# ----------------------------------------------- Search Novel ----------------------------------------------- #


@app.route("/api/addnovel/create_session")
def create_session():
    query = request.args.get("query")
    job_id = request.args.get("job_id")

    if not query:
        return {"status": "error", "message": "No query"}, 400
    if len(query) < 4:
        return {"status": "error", "message": "Query too short"}, 400

    if not job_id:
        return {"status": "error", "message": "No job_id"}, 400

    database.jobs[job_id] = job = JobHandler(job_id)

    job.get_list_of_novel(query)

    return {"status": "success"}, 200


# ----------------------------------------------- Choose Novel ----------------------------------------------- #


@app.route("/api/addnovel/get_novels_founds")
def get_novels_founds():
    """Return search results"""
    job_id = request.args.get("job_id")

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 412

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 202

    if isinstance(job, FinishedJob):
        return {
            "status": "error",
            "message": f"Job aldready finished : {job.get_status()}",
        }, 409

    if not job.search_results:
        return {"status": "error", "message": "No search results"}, 404

    return {"status": "success", "novels": job.search_results}, 200


# ----------------------------------------------- Choose Source ----------------------------------------------- #


@app.route("/api/addnovel/get_sources_founds")
def get_sources_founds():
    """Return list of sources for selected novel"""
    job_id = request.args.get("job_id")
    novel_id = int(request.args.get("novel_id"))

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 412

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 202

    if isinstance(job, FinishedJob):
        return {
            "status": "error",
            "message": f"Job aldready finished : {job.get_status()}",
        }, 409

    job.select_novel(novel_id)

    return {"status": "success", "sources": job.get_list_of_sources()}, 200


# ----------------------------------------------- Start Download ----------------------------------------------- #


@app.route("/api/addnovel/download")
def download():
    """Select Source and start download"""
    job_id = request.args.get("job_id")
    novel_id = int(request.args.get("novel_id"))
    source_id = int(request.args.get("source_id"))

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 412

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 202

    if isinstance(job, FinishedJob):
        url = ""
        try:
            url = job.url
        except Exception as e:
            print(e)

        return {
            "status": "success",
            "message": job.get_status(),
            "url": url,
        }, 200

    if not job.metadata_downloaded:
        job.select_novel(novel_id)
        job.select_source(source_id)
        return {"status": "pending", "message": job.get_status()}, 202

    job.start_download()

    return {"status": "pending", "message": job.get_status()}, 202

    # Busy : Downloading metadata or downloading novel
    #    --> send status
    # Not busy :
    #    Job is finished :
    #        -> send status and url
    #    Metadata not downloaded :
    #       --> Select novel, select source (=> download metadata) --> busy
    #    Metadata downloaded :
    #       --> Start download --> busy


# ----------------------------------------------- Direct Download ----------------------------------------------- #


@app.route("/api/addnovel/direct_download")
def direct_download():
    """Directly download a novel using the novel url"""

    job_id = request.args.get("job_id")

    novel_url = request.args.get("url")
    if not novel_url:
        return {"status": "error", "message": "Missing url"}, 400
    elif not novel_url.startswith("http"):
        return {"status": "error", "message": "Invalid URL"}, 400

    if not job_id in database.jobs or (
        isinstance(database.jobs[job_id], FinishedJob)
        and database.jobs[job_id].original_query != novel_url
    ):
        # If the job is finished and the query doesn't match, overwrite the old job
        database.jobs[job_id] = job = JobHandler(job_id)
    else:
        # If they match it means it is the current job, continue with it
        job = database.jobs[job_id]

    if job.is_busy:  # Job is busy
        return {"status": "pending", "message": job.get_status()}, 202

    elif isinstance(job, FinishedJob):  # job finished
        url = ""
        try:
            url = job.url
        except Exception as e:
            print(e)

        return {
            "status": "success",
            "message": job.get_status(),
            "url": url,
        }, 200

    elif not job.metadata_downloaded:  # job hasn't downloaded metadata yet
        job.prepare_direct_download(novel_url)
        return {"status": "pending", "message": job.get_status()}, 202

    else:  # job has downloaded metadata, isn't busy and isn't finished : start download
        job.start_download()
        return {"status": "pending", "html": job.get_status()}, 202


import time
from threading import Thread


@app.route("/api/addnovel/update")
def update():
    url = request.args.get("url")
    job_id = request.args.get("job_id")

    if job_id in database.jobs:
        job = database.jobs[job_id]
        if isinstance(job, FinishedJob):
            return {"status": "success", "message": job.get_status()}, 200
        else:
            return {"status": "pending", "message": job.get_status()}, 202
    else:
        if url in [job.original_query for job in database.jobs.values()]:
            # If the url is already in the database, return the job id
            # It means that a novel can only be updated once every reboot (database.jobs is cleared on reboot)
            return {
                "status": "error",
                "message": "Novel aldready updating or recently updated",
            }, 409
        Thread(target=_update, args=(url, job_id)).start()
        return {"status": "pending", "message": "Creating session"}, 202


import json
import datetime


def _update(url: str, job_id: str):
    job = database.jobs[job_id] = JobHandler(job_id)
    job.original_query = url
    job.prepare_direct_download(url)
    time.sleep(1)
    while job.is_busy:
        time.sleep(1)

    json_folder_path = lib.LIGHTNOVEL_FOLDER / job.novel_slug / job.source_slug / "json"

    chapters_to_download = []
    for chapter in job.app.crawler.chapters:
        if not (json_folder_path / f"{str(chapter['id']).zfill(5)}.json").exists():
            chapters_to_download.append(chapter)
    job.app.crawler.chapters = chapters_to_download
    print(
        "Downloading chapters : "
        + ", ".join([str(chapter["id"]) for chapter in chapters_to_download])
        + " of "
        + job.novel_slug
    )
    # job.start_download() write metadata, so when updating it will only keep the new chapters
    # and not the aldready downloaded ones.
    # So we need to write the metadata manually

    # get aldready downloaded chapters
    with open(json_folder_path.parent / "meta.json", "r", encoding="utf-8") as f:
        downloaded_chapters = json.load(f)["chapters"]

    job.start_download()

    while job.is_busy and not isinstance(database.jobs[job_id], FinishedJob):
        time.sleep(1)

    # get current metadata and chapters
    with open(json_folder_path.parent / "meta.json", "r", encoding="utf-8") as f:
        metadata = json.load(f)

    metadata["chapters"] += downloaded_chapters
    metadata["chapters"] = sorted(metadata["chapters"], key=lambda x: x["id"])
    metadata["last_update_date"] = datetime.datetime.now().isoformat()

    # write the new metadata
    with open(json_folder_path.parent / "meta.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f)

    # Find the novel
    for downloaded_info in database.all_downloaded_novels:
        if downloaded_info.title == job.app.crawler.novel_title:

            # Find the source
            for source in downloaded_info.sources:
                if source.slug == job.source_slug:
                    # Update the source info
                    source.chapter_count = len(metadata["chapters"])
                    source.first = metadata["chapters"][0]["title"]
                    source.latest = metadata["chapters"][-1]["title"]
                    breaking = True
                    break

            if breaking:
                break

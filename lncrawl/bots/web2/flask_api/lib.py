from __future__ import annotations
from typing import List
from pathlib import Path
import json

# from .... import constants
from .Novel import Novel
from . import database
from . import read_novel_info
from . import utils
from .... import constants

LIGHTNOVEL_FOLDER = Path(constants.DEFAULT_OUTPUT_PATH)
COMMENT_FOLDER = LIGHTNOVEL_FOLDER.parent / "Comments"

if not LIGHTNOVEL_FOLDER.exists():
    LIGHTNOVEL_FOLDER.mkdir()

if not COMMENT_FOLDER.exists():
    COMMENT_FOLDER.mkdir()

config_file = Path("lncrawl/bots/web2/flask_api/config.json")
if not config_file.exists():
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(
            {
                "dev_mode": "true",
                "dev_website_url": "http://localhost:3000",
                "dev_api_url": "http://localhost:5000",
                "website_url": "https://lncrawler.monster",
                "api_url": "https://api.lncrawler.monster",
                "max_ebook_size": 300000000,
                "api_host": "localhost",
                "api_port": 5000,
            },
            f,
            indent=4,
        )
with open(config_file, "r", encoding="utf-8") as f:
    config = json.load(f)

if config["dev_mode"] == "true":
    WEBSITE_URL = config["dev_website_url"]
    API_URL = config["dev_api_url"]
else:
    WEBSITE_URL = config["website_url"]
    API_URL = config["api_url"]

HOST = config["api_host"]
PORT = int(config["api_port"])

MAX_EBOOK_SIZE = int(config["max_ebook_size"])

from . import naming_rules
naming_rules.fix_existing()

database.all_novels: List[Novel] = []
number_of_novel = len(list(LIGHTNOVEL_FOLDER.iterdir()))
print("Loading novels")
novel_folder = None
for i, novel_folder in enumerate(LIGHTNOVEL_FOLDER.iterdir()):
    try:
        if novel_folder.is_dir():
            novel = read_novel_info.get_novel_info(novel_folder)
            database.all_novels.append(novel)
            for tag in novel.tags:
                utils.add_tag(tag)

            print(f"Loaded {i+1}/{number_of_novel} : {novel_folder.name}")
            print(f"\033[F\033[K", end="")

    except Exception as e:
        print(f"Error while reading novel info from {novel_folder.name}: {e}")
        # Uncomment this to debug
        # import traceback

        # traceback.print_exc()

        # import sys
        # sys.exit(1)
if novel_folder: # When the novel folder is empty, novel_folder is null
    print(f"Loaded {number_of_novel}/{number_of_novel} : {novel_folder.name}")

database.set_ranks()


database.all_sources = [
    source for novel in database.all_novels for source in novel.sources
]

database.refresh_sorted_all()

# all_tags: Dict[str,list] = {} # sanatized : [raw : count]
database.top_tags = [
    tag[0]
    for tag in sorted(
        database.all_tags.values(),
        key=lambda x: x[1],
        reverse=True,
    )
][: min(20, len(database.all_tags))]

from . import sitemap

sitemap_file = Path("lncrawl/bots/web2/sitemap.xml")
sitemap.generate_sitemap(sitemap_file)

import threading, time
import shutil


def _update_novel_stats(novel: Novel):
    """
    function to update a novel stats
    args: novel: Novel
    """
    stat_path = novel.path / "stats.json"

    if not stat_path.exists():
        shutil.copyfile("bots/web2/flask_api/_stats.json", stat_path)

    with open(stat_path, "w", encoding="utf-8") as f:

        novel_stats = {
            "clicks": novel.clicks,
            "ratings": novel.ratings,
            "comment_count": novel.comment_count,
            "source_ratings": {
                source.slug: source.source_rating for source in novel.sources
            },
        }

        json.dump(novel_stats, f, indent=4)


def update_novels_stats():
    """function to update each novels stats"""

    for novel in database.all_novels:
        if not novel.path:
            break

        try:
            _update_novel_stats(novel)
        except Exception as e:
            print(f"Error while updating novel stats for {novel}: {e}")
            try:
                print(novel.name)
            except AttributeError:
                print("name unavailable")
            continue

    print("Updated novels stats")


import atexit

# Save novel stats on exit
atexit.register(update_novels_stats)


def periodic_update_novels_stats():
    """function to update each novels stats every hour"""
    while True:
        time.sleep(3600)
        update_novels_stats()


# In case of an internal error, we want to save the stats every hour as well as on exit
# This thread will be terminated at the same time as the main thread
threading.Thread(target=periodic_update_novels_stats, daemon=True).start()

from __future__ import annotations
from typing import List
from pathlib import Path
import json

# from .... import constants
from .Novel import Novel
from . import database
from . import read_novel_info
from . import utils
import constants

LIGHTNOVEL_FOLDER = Path(constants.DEFAULT_OUTPUT_PATH)
COMMENT_FOLDER = LIGHTNOVEL_FOLDER.parent / "Comments"

if not LIGHTNOVEL_FOLDER.exists():
    LIGHTNOVEL_FOLDER.mkdir()

if not COMMENT_FOLDER.exists():
    COMMENT_FOLDER.mkdir()

config_file = Path("lncrawl/bots/web2/config.json")
if not config_file.exists():
    with open(config_file, "w", encoding="utf-8") as f:
        json.dump(
            {"host": "localhost", "port": "5000", "website_url": "localhost:5000", "max_ebook_size": "300_000_000"},
            f,
            indent=4,
        )
with open(config_file, "r", encoding="utf-8") as f:
    config = json.load(f)

HOST = config["host"]
PORT = int(config["port"])
WEBSITE_URL = config["website_url"]
WEBSITE_URL = WEBSITE_URL.strip("/")
MAX_EBOOK_SIZE = int(config["max_ebook_size"])

database.all_novels: List[Novel] = []
for novel_folder in LIGHTNOVEL_FOLDER.iterdir():
    try:
        if novel_folder.is_dir():
            novel = read_novel_info.get_novel_info(novel_folder)
            database.all_novels.append(novel)
            for tag in novel.tags:
                utils.add_tag(tag)

    except Exception as e:
        print(f"Error while reading novel info from {novel_folder.name}: {e}")
        # Uncomment this to debug
        # import traceback

        # traceback.print_exc()
        
        # import sys
        # sys.exit(1)

database.set_ranks()


database.all_sources = [
    source for novel in database.all_novels for source in novel.sources
]

database.refresh_sorted_all()

# all_tags: Dict[str,list] = {} # sanatized : [raw : count]
database.top_tags = [tag[0] for tag in sorted(
    database.all_tags.values(),
    key=lambda x: x[1],
    reverse=True,
)][:min(20, len(database.all_tags))]

from . import sitemap

sitemap_file = Path("lncrawl/bots/web2/sitemap.xml")
sitemap.generate_sitemap(sitemap_file)

import threading, time
import shutil
import sys

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
            "source_ratings": {source.slug: source.source_rating for source in novel.sources},
        }

        json.dump(novel_stats, f, indent=4)


def update_novels_stats():
    """function to update each novels stats"""

    for novel in database.all_novels:
        if not novel.path:
            break

        try :
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
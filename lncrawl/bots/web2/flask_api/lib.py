from __future__ import annotations
from typing import List
from pathlib import Path
import json

# from .... import constants
from .Novel import Novel
from . import database
from . import read_novel_info
import constants
from . import datetools

LIGHTNOVEL_FOLDER = Path(constants.DEFAULT_OUTPUT_PATH)
COMMENT_FOLDER = LIGHTNOVEL_FOLDER.parent / "Comments"

if not LIGHTNOVEL_FOLDER.exists():
    LIGHTNOVEL_FOLDER.mkdir()

if not COMMENT_FOLDER.exists():
    COMMENT_FOLDER.mkdir()

config = {"host": "localhost", "port": "5000", "website_url": "localhost:5000"}
# config_file = Path("lncrawl/bots/web/config.json")
# if not config_file.exists():
#     with open(config_file, "w", encoding="utf-8") as f:
#         json.dump({"host": "localhost", "port":"5000", "website_url":"localhost:5000"}, f, indent=4)
# with open(config_file, "r", encoding="utf-8") as f:
#     config = json.load(f)

WEBSITE_URL = config["website_url"]
HOST = config["host"]
PORT = config["port"]
WEBSITE_URL = WEBSITE_URL.strip("/")


database.all_downloaded_novels: List[Novel] = []
for novel_folder in LIGHTNOVEL_FOLDER.iterdir():
    if novel_folder.is_dir():
        database.all_downloaded_novels.append(
            read_novel_info.get_novel_info(novel_folder)
        )

database.all_downloaded_novels.sort(key=lambda x: sum(x.clicks.values()), reverse=True)
for i, n in enumerate(database.all_downloaded_novels, start=1):
    n.rank = i


database.sorted_all_downloaded_novels = {
    "title": sorted(database.all_downloaded_novels, key=lambda x: x.title),
    "author": sorted(database.all_downloaded_novels, key=lambda x: x.author),
    "rating": sorted(
        database.all_downloaded_novels, key=lambda x: x.overall_rating, reverse=True
    ),
    "views": database.all_downloaded_novels,  # Default sort
    "weekly_views": sorted(
        database.all_downloaded_novels,
        key=lambda x: x.clicks[datetools.current_week()]
        if datetools.current_week() in x.clicks
        else 0,
        reverse=True,
    ),
    "rank": database.all_downloaded_novels,  # Default sort
}
database.sorted_all_downloaded_novels[
    "title-reverse"
] = database.sorted_all_downloaded_novels["title"][::-1]
database.sorted_all_downloaded_novels[
    "author-reverse"
] = database.sorted_all_downloaded_novels["author"][::-1]
database.sorted_all_downloaded_novels[
    "rating-reverse"
] = database.sorted_all_downloaded_novels["rating"][::-1]
database.sorted_all_downloaded_novels[
    "views-reverse"
] = database.sorted_all_downloaded_novels["views"][::-1]
database.sorted_all_downloaded_novels[
    "weekly_views-reverse"
] = database.sorted_all_downloaded_novels["weekly_views"][::-1]
database.sorted_all_downloaded_novels[
    "rank-reverse"
] = database.sorted_all_downloaded_novels["rank"][::-1]

import threading, time
import shutil
import sys


def update_novels_stats():
    """Periodic function to update each novels stats"""

    stopping = False
    while True:
        time.sleep(600)  # 10 minutes

        for novel in database.all_downloaded_novels:
            # Security to avoid stopping the program while updating stats and having corrupted stats file
            # if KeyboardInterrupt or SystemExit is raised, finish the current loop then stop
            for attempt in range(4):
                try:
                    if not novel.path:
                        continue
                    stat_path = novel.path / "stats.json"

                    if not stat_path.exists():
                        shutil.copyfile("bots/web2/flask_api/_stats.json", stat_path)

                    with open(stat_path, "w", encoding="utf-8") as f:
                        novel_stats = {
                            "clicks": novel.clicks,
                            "ratings": novel.ratings,
                        }

                        json.dump(novel_stats, f, indent=4)

                except KeyboardInterrupt or SystemExit:
                    stopping = True
                    continue

                break

            if stopping:
                sys.exit(0)

        print("Updated novels stats")


threading.Thread(target=update_novels_stats, daemon=True).start()

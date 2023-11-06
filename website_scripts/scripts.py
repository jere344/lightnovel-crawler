# region test json

from pathlib import Path
import shutil

folder = Path("Lightnovels")

for novel in folder.iterdir():
    if novel.is_dir():
        for source in novel.iterdir():
            has_json_folder = False
            if source.is_dir():
                for content in source.iterdir():
                    if content.is_dir() and content.name == "json":
                        has_json_folder = True
                        break
                if not has_json_folder:
                    print("Deleting " + str(source))
                    shutil.rmtree(source)

for novel in folder.iterdir():
    if novel.is_dir():
        has_sources = False
        for source in novel.iterdir():
            if source.is_dir():
                has_sources = True
                break
        if not has_sources:
            print("Deleting " + str(novel))
            shutil.rmtree(novel)

# endregion

# region duplicate of cover
import pathlib
import filecmp

cover_to_check = pathlib.Path("Lightnovels/Don T Cry/bestlightnovel-com/cover.jpg")

for novel in pathlib.Path("Lightnovels").iterdir():
    for source in novel.iterdir():
        if source.is_dir() and (source / "cover.jpg").exists():
            # facultatif : check if source is bestlightnovel
            if not source.name == "bestlightnovel-com":
                continue

            if filecmp.cmp(cover_to_check, source / "cover.jpg"):
                print("Duplicate: " + str(novel.name + "/" + source.name))

# endregion

# region renaming folders

import pathlib
import json
from lncrawl.bots.web2.flask_api.naming_rules import clean_name
import imp

naming_rules = imp.load_source(
    "naming_rules", "lncrawl/bots/web2/flask_api/naming_rules.py"
)
import os

import shutil

novel_folder = pathlib.Path("Lightnovels")

for old_folder in novel_folder.iterdir():
    if not old_folder.is_dir():
        continue

    new_name = naming_rules.clean_name(old_folder.name)
    new_folder = novel_folder / new_name
    if (new_folder) == old_folder:
        continue

    print("Renaming " + str(old_folder.name) + " to " + str(new_name))
    if not new_folder.exists():
        old_folder.rename(new_folder)

    else:  # We need to merge the stats.json files
        breaking = False
        for f1 in old_folder.iterdir():
            if not f1.is_dir():
                continue
            for f2 in new_folder.iterdir():
                if not f2.is_dir():
                    continue
                if f1.name == f2.name:
                    print(
                        "\tDuplicate source: " + str(old_folder.name + " / " + f1.name)
                    )
                    breaking = True
                    break
            if breaking:
                break
        if breaking:
            continue

        old_stats_file = old_folder / "stats.json"
        new_stats_file = new_folder / "stats.json"

        with open(old_stats_file, "r") as f:
            old_stats = json.load(f)

        with open(new_stats_file, "r") as f:
            new_stats = json.load(f)

        for key, value in old_stats["clicks"].items():
            if key in new_stats["clicks"]:
                new_stats["clicks"][key] += value
            else:
                new_stats["clicks"][key] = value

        for key, value in old_stats["ratings"].items():
            if key in new_stats["ratings"]:
                new_stats["ratings"][key] = max(new_stats["ratings"][key], value)
            else:
                new_stats["ratings"][key] = value

        new_stats["comment_count"] += old_stats["comment_count"]

        for key, value in old_stats["source_ratings"].items():
            if key in new_stats["source_ratings"]:
                new_stats["source_ratings"][key] = max(
                    new_stats["source_ratings"][key], value
                )
            else:
                new_stats["source_ratings"][key] = value

        # We put the new stats in the old folder to then move it to the new folder
        with open(old_stats_file, "w") as f:
            json.dump(new_stats, f, indent=4)

        print("Merged stats for " + str(old_folder.name))

        for item in os.listdir(old_folder):
            old_item_path = os.path.join(old_folder, item)
            new_item_path = os.path.join(new_folder, item)

            if os.path.isfile(old_item_path) and os.path.exists(new_item_path):
                shutil.copy2(old_item_path, new_item_path)
            elif os.path.isdir(old_item_path):
                shutil.copytree(old_item_path, new_item_path, dirs_exist_ok=True)
        shutil.rmtree(old_folder)

# endregion

# region extract url from sitemap

import requests

sitemap = requests.get("https://lncrawler.monster/sitemap.xml").text

urls = sitemap.split("<loc>")[1:]

with open("urls.txt", "w", encoding="utf-8") as f:
    for url in urls:
        f.write(url.split("</loc>")[0] + "\n")

# endregion

# region update comments to new format
import pathlib


def clean_name(string):
    string = (
        string.strip().lower().replace("’", "'").replace("“", '"').replace("”", '"')
    )
    end_remove = [
        "novel",
        "light novel",
        "web novel",
        "webnovel",
        "ln",
        "wn",
        "completed",
    ]
    for end in end_remove:
        if string.endswith(end):
            string = string[: -len(end)]
        if string.endswith("(" + end + ")"):
            string = string[: -len(end) - 2]
    return string.strip()


for folder in pathlib.Path("Comments").iterdir():
    folder.rename(pathlib.Path("Comments") / clean_name(folder.name))

for folder in pathlib.Path("Comments").iterdir():
    for file in folder.iterdir():
        file.rename(folder / (clean_name(file.stem) + file.suffix))

# endregion

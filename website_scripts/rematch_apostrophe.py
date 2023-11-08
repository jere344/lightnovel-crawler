import pathlib

folders = [f.name for f in pathlib.Path("../Lightnovels").iterdir() if f.is_dir()]

# old -> new
to_fix = {}
for folder in folders:
    if "'s" in folder and folder.replace("'", "") in folders:
        to_fix[folder.replace("'", "")] = folder


import json
import os
import shutil

LIGHTNOVEL_FOLDER = pathlib.Path("../Lightnovels")

for old, new in to_fix.items():
    new_folder = LIGHTNOVEL_FOLDER / new
    old_folder = LIGHTNOVEL_FOLDER / old

    # We need to merge the stats.json files

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

    # We put the new stats in the new folder
    with open(new_stats_file, "w") as f:
        json.dump(new_stats, f, indent=4)
        pass

    print("Merged stats for " + str(old_folder.name))


    for source in os.listdir(old_folder):
        if not os.path.isdir(os.path.join(old_folder, source)):
            continue

        old_source_path = os.path.join(old_folder, source)
        new_source_path = os.path.join(new_folder, source)
        if not os.path.exists(new_source_path):
            shutil.copytree(old_source_path, new_source_path, dirs_exist_ok=True)
            print( "Copying " + str(old_source_path) + " to " + str(new_source_path))

        shutil.rmtree(old_folder)
        print("Deleted " + str(old_folder))


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


def fix_existing():
    import constants
    from pathlib import Path
    import json
    import os
    import shutil

    LIGHTNOVEL_FOLDER = Path(constants.DEFAULT_OUTPUT_PATH)
    from colorama import Fore

    print(Fore.RED + "Fixing existing folders" + Fore.RESET)

    for old_folder in LIGHTNOVEL_FOLDER.iterdir():
        if not old_folder.is_dir():
            continue

        new_name = clean_name(old_folder.name)
        new_folder = LIGHTNOVEL_FOLDER / new_name
        if new_folder == old_folder:
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
                            "\tDuplicate source: "
                            + str(old_folder.name + " / " + f1.name)
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

    print(Fore.GREEN + "Done" + Fore.RESET)

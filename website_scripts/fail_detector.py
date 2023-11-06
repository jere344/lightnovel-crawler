
import pathlib
import json
import random

def delete_folder(folder):
    for f in folder.iterdir():
        if f.is_dir():
            delete_folder(f)
        else:
            f.unlink()
    folder.rmdir()

if pathlib.Path("success.txt").exists():
    with open("success.txt", "r") as f:
        success = f.read().splitlines()
else:
    success = []

for novel in pathlib.Path("../Lightnovels").iterdir():
    if novel.name in success:
        continue

    failed = False
    for source in novel.iterdir():
        if not source.is_dir():
            continue

        if not (source / "meta.json").exists():
            print("deleting source: " + str(novel.name + "/" + source.name))
            delete_folder(source)
            failed = True
            break

        if not (source / "json").is_dir():
            print("deleting source: " + str(novel.name + "/" + source.name))
            delete_folder(source)
            failed = True
            break


        for chapter in (source / "json").iterdir():
            with open(chapter, "r", encoding="utf-8") as f:
                if "Failed to download chapter body" in f.read():
                    # print("Failed: " + str(novel.name + "/" + source.name + "\t" + chapter.name))

                    with open(source / "meta.json", "r", encoding="utf-8") as f:
                        meta = json.load(f)
                        if "novel" in meta and "url" in meta["novel"]:
                            url = meta["novel"]["url"]
                        elif "url" in meta:
                            url = meta["url"]
                        else:
                            print("glitched source: " + str(novel.name + "/" + source.name))
                            failed = True
                            break

                    print(
                        "https://api.lncrawler.monster/addnovel/update?job_id="
                        + str(random.randrange(1, 10000))
                        + "&&url="
                        + url
                    )

                    failed = True
                    break

    if not failed:
        with open("success.txt", "a") as f:
            f.write(novel.name + "\n")

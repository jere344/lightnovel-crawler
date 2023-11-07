import pathlib
import json
import random

# Fast only check the last chapter of each source

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
    for source in novel.iterdir():
        if novel.name + "/" + source.name in success:
            continue

        if not source.is_dir():
            continue

        if not (source / "meta.json").exists():
            print("deleting source: " + str(novel.name + "/" + source.name))
            delete_folder(source)
            break

        if not (source / "json").is_dir():
            print("deleting source: " + str(novel.name + "/" + source.name))
            delete_folder(source)
            break

        chapters = sorted((source / "json").iterdir(), reverse=True)
        chapter = chapters[0]

        with open(chapter, "r", encoding="utf-8") as f:
            chap_text = f.read()

        if "Failed to download chapter body" in chap_text:

            with open(source / "meta.json", "r", encoding="utf-8") as f:
                meta = json.load(f)
                if "novel" in meta and "url" in meta["novel"]:
                    url = meta["novel"]["url"]
                elif "url" in meta:
                    url = meta["url"]
                else:
                    url = ""
                    print(
                        "glitched source: "
                        + str(novel.name + "/" + source.name)
                    )
            if url != "":
                print(
                    "https://api.lncrawler.monster/addnovel/update?job_id="
                    + str(random.randrange(1, 10000))
                    + "&&url="
                    + url
                )
        else:
            with open("success.txt", "a") as f:
                f.write(novel.name + "/" + source.name + "\n")

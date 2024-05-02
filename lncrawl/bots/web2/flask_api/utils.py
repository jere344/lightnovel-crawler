from pathlib import Path
from typing import Optional
from .Novel import Novel, NovelFromSource
from . import database
from . import sanatize
from . import naming_rules
import urllib.parse


def get_novel_with_slug(novel_slug) -> Optional[Novel]:
    """
    Returns the novel with the given slug
    """
    novel = naming_rules.clean_name(urllib.parse.unquote_plus(novel_slug))
    return next((n for n in database.all_novels if n.cleaned_folder_name == novel), None)


def get_novel_with_url(url: str) -> Optional[Novel]:
    """
    Returns the novel with the url
    """
    url = url.replace("http://", "").replace("https://", "").replace("\\", "/")
    if url.startswith("/"):
        url = url[1:]
    novel_slug = url.split("/")[1]
    return get_novel_with_slug(novel_slug)

def get_source_with_slugs(novel_slug, source_slug) -> Optional[NovelFromSource]:
    """
    Returns the source with the given slugs
    """
    novel = get_novel_with_slug(novel_slug)
    if not novel:
        return None
    for source in novel.sources:
        if source.slug == source_slug:
            return source
    return None

def find_source_with_path(novel_and_source_path: Path) -> Optional[NovelFromSource]:
    """
    Find the NovelFromSource object corresponding to the path
    """
    novel_and_source_path = novel_and_source_path.parent.parent / naming_rules.clean_name(novel_and_source_path.parent.name) / novel_and_source_path.name
    novel = None
    for n in database.all_novels:
        if novel_and_source_path.parent == n.path:
            novel = n
            break
    if not novel:
        return None

    source = None
    for s in novel.sources:
        if novel_and_source_path == s.path:
            source = s
            break
    if not source:
        return None

    return source


import hashlib


def shuffle_ip(ip) -> str:
    """Just a way to not keep ip in clear text, we remove the 5th and 7th character and hash it"""
    return hashlib.sha256(str(ip[:4] + ip[5:6] + ip[7:]).encode()).hexdigest()


def add_novel_to_database(novel: Novel):
    """
    To be used when lncrawn is running and we want to add a novel to the database
    """

    if novel in database.all_novels:
        # We find the novel in the database and take its stats if they are higher to get the most recent stats
        for dbn in database.all_novels:
            if dbn == novel:
                if sum(dbn.clicks.values()) > sum(novel.clicks.values()):
                    novel.clicks = dbn.clicks
                    novel.ratings = dbn.ratings
                    novel.comment_count = dbn.comment_count

        database.all_novels.remove(novel)
    database.all_novels.append(novel)

    for new_source in novel.sources:
        for existing_source in database.all_sources:
            if new_source == existing_source :
                database.all_sources.remove(existing_source)

        database.all_sources.append(new_source)
        
    database.set_ranks()
    database.refresh_sorted_all()
    database.set_prefered_sources()

    


def has_tags(novel: Novel, tags: list) -> bool:
    """
    Returns True if the novel has all the tags
    tag starting with - means it must not have it
    use sanatized tags
    """
    return all(
        (tag.startswith("-") and tag[1:] not in novel.sanatized_tags)
        or (not tag.startswith("-") and tag in novel.sanatized_tags)
        for tag in tags
    )
    

def add_tag(tag):
    sanatized_tag = sanatize.sanitize(tag)
    if sanatized_tag in database.all_tags:
        database.all_tags[sanatized_tag][1] += 1
    else:
        database.all_tags[sanatized_tag] = [tag, 1]

from PIL import Image
def create_miniature(path, output_path, size=200):
    """
    Create a miniature of the image at path and save it to output_path
    Biggest side will be 200px and the other will be scaled accordingly
    """
    
    img = Image.open(path)
    img.thumbnail((size, size))
    img.save(output_path)
    img.close()
    return output_path


import subprocess
import shutil

COMPRESSION_LEVEL = 5
COMPRESSION_ALGORITHM = "LZMA2"
def compress_folder_to_tar_7zip(source_folder:Path, json_folder:str, tarfile_path:Path):
    try :
        # result = subprocess.run(["7z", "a", tarfile_path, json_folder], cwd=source_folder)
        result = subprocess.run(["7z", "a", tarfile_path, json_folder, f"-mx={COMPRESSION_LEVEL}", f"-m0={COMPRESSION_ALGORITHM}", "-bso0"], cwd=source_folder)
        if result.returncode == 0:
            print(f"Compression successful. Deleting {source_folder}/{json_folder}")
            shutil.rmtree(f"{source_folder}/{json_folder}")
        else:
            print("Compression failed. Folder not deleted.")
        return result.returncode == 0
    except Exception as e:
        print(f"Error while compressing {source_folder}/{json_folder} to {tarfile_path}: {e}")
        return False

def extract_tar_7zip_folder(tar_file_path:Path, output_folder:Path):
    try :
        result = subprocess.run(["7z", "x", tar_file_path, f"-o{output_folder}", "-bso0"])
        if result.returncode == 0:
            print(f"Extraction successful. Deleting {tar_file_path}")
            tar_file_path.unlink()
        else:
            print("Extraction failed. Folder not deleted.")
        return result.returncode == 0
    except Exception as e:
        print(f"Error while extracting {tar_file_path} to {output_folder}: {e}")
        return False
        


def get_file_content_from_tar_7zip(tar_file_path:Path, target_file_name:str):
    try:
        result = subprocess.run(["7z", "e", tar_file_path, f"-so", target_file_name], capture_output=True)
        return result.stdout.decode("utf-8")
    except Exception as e:
        print(f"Error while extracting {target_file_name} from {tar_file_path}: {e}")
        return None


import json

def get_chapter(source: NovelFromSource, chapter_number: int) -> dict:
    """
    Returns the chapter with the given number
    """
    if (source.path / "json" / f"{chapter_number:05}.json").exists():
        with open(source.path / "json" / f"{chapter_number:05}.json", "r", encoding="utf-8") as f:
            return json.load(f)

    tar_file_path = source.path / "json.7z"

    if tar_file_path.exists():
        chapter_path_in_tar = f"json/{chapter_number:05}.json"
        chapter = get_file_content_from_tar_7zip(tar_file_path, chapter_path_in_tar)
        if chapter:
            return json.loads(chapter)
    
    return None

# utils.extract_tar_7zip_folder(LIGHTNOVEL_FOLDER / "a transmigrator's privilege\\readlightnovel-app\json.7z", LIGHTNOVEL_FOLDER /"a transmigrator's privilege\\readlightnovel-app")
# utils.compress_folder_to_tar_7zip(LIGHTNOVEL_FOLDER / "a transmigrator's privilege\\readlightnovel-app", "json", LIGHTNOVEL_FOLDER / "a transmigrator's privilege\\readlightnovel-app\\json.7z")

import time
def run_tasks(tasks):
    len_tasks = len(tasks)
    for i, (task, args) in enumerate(tasks, 1):
        result = task(*args)
        if result:
            print(f"Task {i}/{len_tasks} done")
        else:
            print(f"Task {i}/{len_tasks} failed")
        time.sleep(5)
    print("All tasks done")
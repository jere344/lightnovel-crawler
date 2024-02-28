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
            if new_source == existing_source and new_source.last_update_date > existing_source.last_update_date:
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

from pathlib import Path
from typing import Optional
from .Novel import Novel, NovelFromSource
from . import database
from . import sanatize


def get_novel_with_slug(novel_slug) -> Optional[Novel]:
    """
    Returns the novel with the given slug
    """
    return next(n for n in database.all_novels if n.slug == novel_slug)


def get_novel_with_url(url: str) -> Optional[Novel]:
    """
    Returns the novel with the url
    """
    url = url.replace("http://", "").replace("https://", "")
    if url.startswith("/"):
        url = url[1:]
    novel_slug = url.split("/")[1]
    return get_novel_with_slug(novel_slug)


def find_source_with_path(novel_and_source_path: Path) -> Optional[NovelFromSource]:
    """
    Find the NovelFromSource object corresponding to the path
    """
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
        database.all_novels.remove(novel)
    database.all_novels.append(novel)

    for source in novel.sources:
        if source in database.all_sources:
            database.all_sources.remove(source)
        database.all_sources.append(source)
        
    database.refresh_sorted_all()
    database.set_ranks()

    for tag in novel.tags:
        add_tag(tag)
    


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
    
from pathlib import Path
from typing import Optional
from .Novel import Novel, NovelFromSource
from . import database


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
    """Just a way to not keep ip in clear text"""
    return hashlib.sha256(str(ip[:5] + ip[7:]).encode()).hexdigest()


def add_novel_to_database(novel: Novel):
    """
    To be used when lncrawn is running and we want to add a novel to the database
    """

    novel.rank = len(database.all_novels) + 1

    if novel in database.all_novels:
        database.all_novels.remove(novel)
    database.all_novels.append(novel)

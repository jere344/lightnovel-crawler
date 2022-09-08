from pathlib import Path
from typing import Optional
from .Novel import Novel, NovelFromSource
from . import database


def find_novel_in_database(novel_slug) -> Optional[Novel]:
    return next(n for n in database.all_downloaded_novels if n.slug == novel_slug)


def find_source_with_path(novel_and_source_path: Path) -> Optional[NovelFromSource]:
    """
    Find the NovelFromSource object corresponding to the path
    """
    novel = None
    for n in database.all_downloaded_novels:
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


def shuffle_ip(ip) -> str:
    """Just a way to not keep ip in cache"""
    return str(hash(ip[:5] + ip[7:]))[:16]

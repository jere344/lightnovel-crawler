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


import hashlib


def shuffle_ip(ip) -> str:
    """Just a way to not keep ip in clear text"""
    return hashlib.sha256(str(ip[:5] + ip[7:]).encode()).hexdigest()


def reverse_insort(a, x, lo=0, hi=None, key=lambda x: x):
    """Insert item x in list a, and keep it reverse-sorted assuming a
    is reverse-sorted.

    If x is already in a, insert it to the right of the rightmost x.

    Optional args lo (default 0) and hi (default len(a)) bound the
    slice of a to be searched.
    """
    if lo < 0:
        raise ValueError("lo must be non-negative")
    if hi is None:
        hi = len(a)
    while lo < hi:
        mid = (lo + hi) // 2

        if key(x) > key(a[mid]):
            hi = mid
        else:
            lo = mid + 1
    a.insert(lo, x)


import bisect


def add_novel(novel: Novel):
    novel.rank = len(database.all_downloaded_novels) + 1

    database.all_downloaded_novels.append(novel)
    bisect.insort(
        database.sorted_all_downloaded_novels["title"], novel, key=lambda x: x.title
    )
    bisect.insort(
        database.sorted_all_downloaded_novels["author"], novel, key=lambda x: x.author
    )
    database.sorted_all_downloaded_novels["rating"].append(novel)
    database.sorted_all_downloaded_novels["views"].append(novel)

    reverse_insort(
        database.sorted_all_downloaded_novels["title-reverse"],
        novel,
        key=lambda x: x.title,
    )
    reverse_insort(
        database.sorted_all_downloaded_novels["author-reverse"],
        novel,
        key=lambda x: x.author,
    )
    database.sorted_all_downloaded_novels["rating-reverse"].insert(0, novel)
    database.sorted_all_downloaded_novels["views-reverse"].insert(0, novel)
    database.sorted_all_downloaded_novels["rank-reverse"].insert(0, novel)

from typing import List, Union
from .Novel import Novel

all_downloaded_novels: List[Novel] = []

sorted_all_downloaded_novels = {
    "title": sorted(all_downloaded_novels, key=lambda x: x.title),
    "author": sorted(all_downloaded_novels, key=lambda x: x.author),
    "rating": sorted(
        all_downloaded_novels, key=lambda x: x.overall_rating, reverse=True
    ),
    "views": sorted(
        all_downloaded_novels, key=lambda x: x.clicks, reverse=True
    ),
    "rank": all_downloaded_novels,  # Default sort
    "title-reverse": sorted(
        all_downloaded_novels, key=lambda x: x.title, reverse=True
    ),
    "author-reverse": sorted(
        all_downloaded_novels, key=lambda x: x.author, reverse=True
    ),
    "rating-reverse": sorted(
        all_downloaded_novels, key=lambda x: x.overall_rating
    ),
    "views-reverse": sorted(all_downloaded_novels, key=lambda x: x.clicks),
    "rank-reverse": all_downloaded_novels[::-1],
}

import bisect
def add_novel(novel : Novel) :
    novel.rank = len(all_downloaded_novels) + 1
    bisect.insort(sorted_all_downloaded_novels["title"], novel, key=lambda x: x.title)
    bisect.insort(sorted_all_downloaded_novels["author"], novel, key=lambda x: x.author)
    sorted_all_downloaded_novels["rating"].append(novel)
    sorted_all_downloaded_novels["views"].append(novel)
    all_downloaded_novels.append(novel)
    
    bisect.insort(sorted_all_downloaded_novels["title-reverse"], novel, key=lambda x: x.title, reverse=True)
    bisect.insort(sorted_all_downloaded_novels["author-reverse"], novel, key=lambda x: x.author, reverse=True)
    sorted_all_downloaded_novels["rating-reverse"].insert(0, novel)
    sorted_all_downloaded_novels["views-reverse"].insert(0, novel)
    sorted_all_downloaded_novels["rank-reverse"].insert(0, novel)
    sorted_all_downloaded_novels["rank"].insert(0, novel)


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}

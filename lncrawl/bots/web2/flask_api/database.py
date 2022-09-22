from typing import List, Union
from .Novel import Novel, NovelFromSource
import datetime
from . import datetools

all_novels: List[Novel] = []

# placeholder, will be filled by lib.py
sorted_all_novels = {
    "title": lambda: sorted(all_novels, key=lambda x: x.title),
    "author": lambda: sorted(all_novels, key=lambda x: x.author),
    "rating": lambda: sorted(all_novels, key=lambda x: x.overall_rating, reverse=True),
    "views": lambda: sorted(
        all_novels, key=lambda x: sum(x.clicks.values()), reverse=True
    ),
    "weekly_views": lambda: sorted(
        all_novels,
        key=lambda x: x.clicks[datetools.current_week()]
        if datetools.current_week() in x.clicks
        else 0,
        reverse=True,
    ),
    "rank": lambda: all_novels,  # Default sort
    "last_updated": lambda: sorted(
        [
            source
            for novel in all_novels
            for source in novel.sources
            if source.last_update_date
        ],
        key=lambda x: datetime.datetime.fromisoformat(x.last_update_date),
        reverse=True,
    ),
    "title-reverse": lambda: sorted_all_novels["title"]()[::-1],
    "author-reverse": lambda: sorted_all_novels["author"]()[::-1],
    "rating-reverse": lambda: sorted_all_novels["rating"]()[::-1],
    "views-reverse": lambda: sorted_all_novels["views"]()[::-1],
    "weekly_views-reverse": lambda: sorted_all_novels["weekly_views"]()[::-1],
    "rank-reverse": lambda: sorted_all_novels["rank"]()[::-1],
    "last_updated-reverse": lambda: sorted_all_novels["last_updated"]()[::-1],
}


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}
jobs_snapshots = {}
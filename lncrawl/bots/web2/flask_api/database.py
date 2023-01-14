from typing import List, Union, Dict
from .Novel import Novel, NovelFromSource
import datetime
from . import datetools

# placeholders, will be filled by lib.py
all_tags: Dict[str,list] = {} # sanatized : [raw : count]
all_novels: List[Novel]
top_tags:list
all_sources: List[NovelFromSource]

sorted_all_novels = {
    "title": lambda: sorted(all_novels, key=lambda x: x.title),
    "author": lambda: sorted(all_novels, key=lambda x: x.author),
    "rating": lambda: sorted(all_novels, key=lambda x: (x.overall_rating, x.ratings_count), reverse=True),
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
    "title-reverse": lambda: sorted_all_novels["title"]()[::-1],
    "author-reverse": lambda: sorted_all_novels["author"]()[::-1],
    "rating-reverse": lambda: sorted_all_novels["rating"]()[::-1],
    "views-reverse": lambda: sorted_all_novels["views"]()[::-1],
    "weekly_views-reverse": lambda: sorted_all_novels["weekly_views"]()[::-1],
    "rank-reverse": lambda: sorted_all_novels["rank"]()[::-1],
}

sorted_all_sources = {
    "last_updated": lambda: sorted(
            [
                source
                for source in all_sources
                if source.last_update_date
            ],
            key=lambda x: datetime.datetime.fromisoformat(x.last_update_date),
            reverse=True,
        ),
    "last_updated-reverse": lambda: sorted_all_sources["last_updated"]()[::-1],
}

from functools import lru_cache
#Use the lru_cache decorator to memoize the lambdas
for key, value in sorted_all_novels.items():
    sorted_all_novels[key] = lru_cache()(value)

for key, value in sorted_all_sources.items():
    sorted_all_sources[key] = lru_cache()(value)

# Register a callback that need to be called when the all_novels list is modified
def refresh_sorted_all():
    """Clear the cache of the lambdas : refresh the sorted lists"""
    for key, value in sorted_all_novels.items():
        value.cache_clear()
    for key, value in sorted_all_sources.items():
        value.cache_clear()
        

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]
    jobs_snapshots: dict[str, JobHandler]

jobs = {}
jobs_snapshots = {}

def set_ranks():
    for i, n in enumerate(all_novels, start=1):
        n.rank = i
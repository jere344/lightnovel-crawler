from typing import List, Union
from .Novel import Novel

all_downloaded_novels: List[Novel] = []

sorted_all_downloaded_novels = {
    "title": lambda: sorted(all_downloaded_novels, key=lambda x: x.title),
    "author": lambda: sorted(all_downloaded_novels, key=lambda x: x.author),
    "rating": lambda: sorted(
        all_downloaded_novels, key=lambda x: x.overall_rating, reverse=True
    ),
    "views": lambda: sorted(
        all_downloaded_novels, key=lambda x: x.clicks, reverse=True
    ),
    "rank": lambda: all_downloaded_novels,  # Default sort
    "title-reverse": lambda: sorted(
        all_downloaded_novels, key=lambda x: x.title, reverse=True
    ),
    "author-reverse": lambda: sorted(
        all_downloaded_novels, key=lambda x: x.author, reverse=True
    ),
    "rating-reverse": lambda: sorted(
        all_downloaded_novels, key=lambda x: x.overall_rating
    ),
    "views-reverse": lambda: sorted(all_downloaded_novels, key=lambda x: x.clicks),
    "rank-reverse": lambda: all_downloaded_novels[::-1],
}

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}

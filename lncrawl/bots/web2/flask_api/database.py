from typing import List, Union
from .Novel import Novel

all_downloaded_novels: List[Novel] = []

# placeholder, will be filled by lib.py
sorted_all_downloaded_novels = {
    "title": [],
    "author": [],
    "rating": [],
    "views": [],
    "weekly_views": [],
    "rank": [],
    "title-reverse": [],
    "author-reverse": [],
    "rating-reverse": [],
    "views-reverse": [],
    "weekly_views-reverse": [],
    "rank-reverse": [],
}


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}

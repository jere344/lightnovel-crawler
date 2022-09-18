from typing import List, Union
from .Novel import Novel, NovelFromSource

all_novels: List[Novel] = []

# placeholder, will be filled by lib.py
sorted_all_novels = {
    "title": List[Novel],
    "author": List[Novel],
    "rating": List[Novel],
    "views": List[Novel],
    "weekly_views": List[Novel],
    "rank": List[Novel],
    "last_update": List[
        NovelFromSource
    ],  # ! RETURN NOVELFROMSOURCE LIST, NOT NOVEL LIST
    "title-reverse": List[Novel],
    "author-reverse": List[Novel],
    "rating-reverse": List[Novel],
    "views-reverse": List[Novel],
    "weekly_views-reverse": List[Novel],
    "rank-reverse": List[Novel],
    "last_updated-reverse": List[
        NovelFromSource
    ],  # ! RETURN NOVELFROMSOURCE LIST, NOT NOVEL LIST
}


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}

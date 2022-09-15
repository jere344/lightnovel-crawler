from typing import List, Union
from .Novel import Novel

all_downloaded_novels: List[Novel] = []

# placeholder, will be filled by lib.py
sorted_all_downloaded_novels = {
    "title": [],
    "author": [],
    "rating": [],
    "views": [],
    "rank": [],
    "title-reverse": [],
    "author-reverse": [],
    "rating-reverse": [],
    "views-reverse": [],
    "rank-reverse": [],
}
# {
#     "title": sorted(all_downloaded_novels, key=lambda x: x.title),
#     "author": sorted(all_downloaded_novels, key=lambda x: x.author),
#     "rating": sorted(
#         all_downloaded_novels, key=lambda x: x.overall_rating, reverse=True
#     ),
#     "views": sorted(
#         all_downloaded_novels, key=lambda x: x.clicks, reverse=True
#     ),
#     "rank": all_downloaded_novels,  # Default sort
#     "title-reverse": sorted(
#         all_downloaded_novels, key=lambda x: x.title, reverse=True
#     ),
#     "author-reverse": sorted(
#         all_downloaded_novels, key=lambda x: x.author, reverse=True
#     ),
#     "rating-reverse": sorted(
#         all_downloaded_novels, key=lambda x: x.overall_rating
#     ),
#     "views-reverse": sorted(all_downloaded_novels, key=lambda x: x.clicks),
#     "rank-reverse": all_downloaded_novels[::-1],
# }


from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .downloader.Job import JobHandler, FinishedJob

    jobs: dict[str, Union[FinishedJob, JobHandler]]

jobs = {}

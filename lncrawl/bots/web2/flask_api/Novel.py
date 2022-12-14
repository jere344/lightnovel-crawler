from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import quote_plus, quote
from typing import Any, List, Optional

from . import datetools
from . import sanatize


@dataclass
class Novel:
    """
    Holds information about a novel.
    """

    path: Path = field(repr=False)

    title: str = ""
    cover: Optional[str] = None
    author: str = ""
    chapter_count: int = 0
    volume_count: int = 0
    first: str = ""
    latest: str = ""
    summary: str = ""
    tags : set = field(default_factory=set)
    language: str = "en"
    rank: Optional[int] = None
    comment_count: int = 0

    prefered_source: Optional[NovelFromSource] = field(
        default=None,
    )
    clicks: dict = field(default_factory=dict)
    sources: list[NovelFromSource] = field(default_factory=list, repr=False)
    ratings: dict[str, int] = field(default_factory=dict, repr=False)

    # Auto
    current_week_clicks: int = field(
        init=False,
        default=property(
            lambda self: self.clicks[datetools.current_week()]
            if datetools.current_week() in self.clicks
            else 0
        ),
    )

    sanatized_tags: List[str] = field(
        init=False, default=property(lambda self: [sanatize.sanitize(t) for t in self.tags])
    )

    search_words: List[str] = field(
        init=False,
        default=property(
            lambda self: sanatize.sanitize(self.title + " " + self.author).split(" ")
        ),
    )
    overall_rating: float = field(
        init=False,
        default=property(lambda self: sum(self.ratings.values()) / len(self.ratings)),
    )
    ratings_count: int = field(
        init=False, default=property(lambda self: len(self.ratings))
    )
    source_count: int = field(
        init=False, default=property(lambda self: len(self.sources))
    )
    slug: str = field(
        init=False, default=property(lambda self: quote_plus(self.path.name))
    )
    str_path: str = field(init=False, default=property(lambda self: str(self.path)))

    def __eq__(self, other: Any) -> bool:
        """
        Novel are equal if they have the same slug
        """
        if isinstance(other, Novel):
            return self.slug == other.slug
        return False

    def __hash__(self) -> int:
        """
        The hash of a novel is the hash of its title.
        """
        return hash(self.title)

    def asdict(self) -> dict:
        """
        Returns a dictionary representation of the novel.
        """
        try :
            prefered_source_slug = self.prefered_source.slug
        except AttributeError:
            prefered_source_slug = None

        return {
            # "path": self.path,
            "title": self.title,
            "cover": self.cover,
            "author": self.author,
            "chapter_count": self.chapter_count,
            # "volume_count": self.volume_count,
            # "first": self.first,
            "latest": self.latest,
            # "summary": self.summary,
            "language": self.language,
            "clicks": sum(self.clicks.values()),
            "current_week_clicks": self.current_week_clicks,
            "rank": self.rank,
            "prefered_source": prefered_source_slug,
            "sources": {source.slug: source.language for source in self.sources},
            # "ratings": self.ratings,
            # "search_words": self.search_words,
            "overall_rating": self.overall_rating,
            "ratings_count": self.ratings_count,
            "source_count": self.source_count,
            "slug": self.slug,
            # "str_path": self.str_path,
            "comment_count": self.comment_count,
        }


@dataclass
class NovelFromSource:
    """
    Hold information about a novel from a source.
    """

    path: Path = field(repr=False)

    novel: Novel = field(repr=False, init=False)

    title: str = ""
    cover: Optional[str] = None
    author: str = ""
    chapter_count: int = 0
    volume_count: int = 0
    slug: str = ""
    first: str = ""
    latest: str = ""
    summary: str = ""
    tags : List[str] = field(default_factory=list)
    language: str = "en"
    url: str = ""
    last_update_date: str = ""  # isoformat : ex : "2022-09-10T20:59:35.166239"

    # Auto

    slug: str = field(
        init=False, default=property(lambda self: quote_plus(self.path.name))
    )
    str_path: str = field(init=False, default=property(lambda self: str(self.path)))

    xml_url: str = field(
        init=False,
        default=property(
            lambda self: f"{quote(self.novel.path.name)}/{quote(self.path.name)}/"
        ),
    )

    def asdict(self) -> dict:
        """
        Returns a dictionary representation of the novel from source.
        """
        return {
            # "path": self.path,
            "novel": self.novel.asdict(),
            "title": self.title,
            "cover": self.cover,
            "author": self.author,
            "chapter_count": self.chapter_count,
            # "volume_count": self.volume_count,
            "slug": self.slug,
            "first": self.first,
            "latest": self.latest,
            "summary": self.summary,
            "tags": self.tags,
            "language": self.language,
            # "str_path": self.str_path,
            "url": self.url,
            "last_update_date": self.last_update_date,
        }

    def __eq__(self, other: Any) -> bool:
        """
        Novel are equal if they have the same slug
        """
        if isinstance(other, NovelFromSource):
            return self.slug == other.slug
        return False

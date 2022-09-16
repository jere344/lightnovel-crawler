from __future__ import annotations
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import quote_plus
from typing import Any, List, Optional, Union

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
    language: str = "en"
    rank: Optional[int] = None

    prefered_source: Optional[NovelFromSource] = field(
        default=None,
    )
    clicks: dict = field(default_factory=dict)
    sources: list[NovelFromSource] = field(default_factory=list, repr=False)
    ratings: dict[str, int] = field(default_factory=dict, repr=False)

    # Auto
    current_week_clicks: int = field(
        init=False,
        default=property(lambda self: self.clicks[datetools.current_week()] if datetools.current_week() in self.clicks else 0),
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
        Novel and NovelFromSource are equal if they have the same title
        """
        if isinstance(type(other), Union[Novel, NovelFromSource]):
            return self.title == other.title
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
            "rank": self.rank,
            "prefered_source": self.prefered_source.slug,
            "sources": {source.slug: source.language for source in self.sources},
            # "ratings": self.ratings,
            # "search_words": self.search_words,
            "overall_rating": self.overall_rating,
            "ratings_count": self.ratings_count,
            "source_count": self.source_count,
            "slug": self.slug,
            # "str_path": self.str_path,
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
    language: str = "en"
    url: str = ""

    # Auto

    slug: str = field(
        init=False, default=property(lambda self: quote_plus(self.path.name))
    )
    str_path: str = field(init=False, default=property(lambda self: str(self.path)))

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
            "language": self.language,
            # "str_path": self.str_path,
            "url": self.url,
        }

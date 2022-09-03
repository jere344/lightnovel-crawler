import json
from .Novel import Novel, NovelFromSource
from pathlib import Path
import shutil

from . import sanatize


def get_novel_info(novel_folder: Path) -> Novel:
    """
    Collects information about a novel locally.
    source isn't specified, so we need to find a source that has sufficient
        metadata for the novel and set it to prefered_source.
    Metadata are randomly picked from the sources.
    """

    path = novel_folder.absolute()
    cover = None
    prefered_source = None
    author = ""
    chapter_count = 0
    latest = ""
    first = ""
    volume_count = 0
    title = ""
    summary = ""
    sources = []

    # --------------------------------------------------------------------------
    language: set[str] = set()

    for source_folder in novel_folder.iterdir():
        if not source_folder.is_dir():
            continue

        source = _get_source_info(source_folder)

        if not cover and source.cover:
            cover = source.cover
            prefered_source = source

        if not author and source.author:
            author = source.author

        if not chapter_count and source.chapter_count:
            chapter_count = source.chapter_count

        if not latest and source.latest:
            latest = source.latest

        if not first and source.first:
            first = source.first

        if not volume_count and source.volume_count:
            volume_count = source.volume_count

        if not title and source.title:
            title = source.title

        if not summary and source.summary:
            summary = source.summary

        if source.language:
            language.add(source.language)

        sources.append(source)

    language = ", ".join(language)

    if not title:
        title = novel_folder.name

    # --------------------------------------------------------------------------

    novel_stats_file = Path(novel_folder / "stats.json")

    if not novel_stats_file.exists():
        shutil.copy(str(Path(__file__).parent / "_stats.json"), str(novel_stats_file))

    with open(novel_stats_file, "r", encoding="utf-8") as f:
        novel_stats = json.load(f)
        clicks = novel_stats["clicks"]
        ratings = novel_stats["ratings"]

    novel = Novel(
        path=path,
        title=title,
        cover=cover,
        author=author,
        chapter_count=chapter_count,
        volume_count=volume_count,
        first=first,
        latest=latest,
        summary=summary,
        language=language,
        clicks=clicks,
        rank=None,
        prefered_source=prefered_source,
        sources=sources,
        ratings=ratings,
    )

    for source in novel.sources:
        source.novel = novel

    return novel


def _get_source_info(source_folder: Path) -> NovelFromSource:
    """
    Collects information about a novel for a source.
    Source is specified, so we can just read the meta.json file...
    """
    path = source_folder.absolute()

    cover = (
        f"{source_folder.parent.name}/{source_folder.name}/cover.jpg"
        if (source_folder / "cover.jpg").exists()
        else None
    )
    if (source_folder / "meta.json").exists():
        with open(source_folder / "meta.json", "r", encoding="utf-8") as f:
            meta = json.load(f)

        try:
            latest = meta["chapters"][-1]["title"]
        except KeyError:
            latest = ""
        except IndexError:
            latest = ""
        try:
            first = meta["chapters"][0]["title"]
        except KeyError:
            first = ""
        except IndexError:
            first = ""
        author = meta["author"] if "author" in meta else ""
        chapter_count = len(meta["chapters"]) if "chapters" in meta else 0
        volume_count = len(meta["volumes"]) if "volumes" in meta else 0
        title = meta["title"] if "title" in meta else source_folder.parent.name
        language = meta["language"] if "language" in meta else "en"
        url = meta["url"] if "url" in meta else ""
        summary = meta["summary"] if "summary" in meta else ""

    source = NovelFromSource(
        path=path,
        title=title,
        cover=cover,
        author=author,
        chapter_count=chapter_count,
        volume_count=volume_count,
        first=first,
        latest=latest,
        summary=summary,
        language=language,
        url=url,
    )

    return source

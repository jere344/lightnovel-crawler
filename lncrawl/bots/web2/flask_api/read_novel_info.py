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

        if not source:
            continue

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
        clicks = novel_stats["clicks"] if "clicks" in novel_stats and isinstance(novel_stats["clicks"], dict) else {}
        ratings = novel_stats["ratings"]
        comment_count = novel_stats["comment_count"] if "comment_count" in novel_stats else 0

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
        comment_count=comment_count,
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
    if not (source_folder / "meta.json").exists():
        return None

    with open(source_folder / "meta.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        # For backward compatibility
        if "novel" in data :
            novel_metadata = data["novel"]
        else :
            novel_metadata = data

    try:
        latest = novel_metadata["chapters"][-1]["title"]
    except KeyError:
        latest = ""
    except IndexError:
        latest = ""
    try:
        first = novel_metadata["chapters"][0]["title"]
    except KeyError:
        first = ""
    except IndexError:
        first = ""
    author = novel_metadata["author"] if "author" in novel_metadata else ""
    chapter_count = len(novel_metadata["chapters"]) if "chapters" in novel_metadata else 0
    volume_count = len(novel_metadata["volumes"]) if "volumes" in novel_metadata else 0
    title = novel_metadata["title"] if "title" in novel_metadata else source_folder.parent.name
    language = novel_metadata["language"] if "language" in novel_metadata else "en"
    url = novel_metadata["url"] if "url" in novel_metadata else ""
    summary = novel_metadata["summary"] if "summary" in novel_metadata else ""

    last_update_date = data["last_update_date"] if "last_update_date" in data else ""

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
        last_update_date=last_update_date,
    )

    return source

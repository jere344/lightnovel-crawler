import json
from .Novel import Novel, NovelFromSource
from pathlib import Path
import shutil


def get_novel_info(novel_folder: Path) -> Novel:
    """
    Collects information about a novel locally.
    source isn't specified, so we need to find a source that has sufficient
        metadata for the novel and set it to prefered_source.
    Metadata are randomly picked from the sources.
    """

    # region Get Novel Stats
    novel_stats_file = Path(novel_folder / "stats.json")

    if not novel_stats_file.exists():
        shutil.copy(str(Path(__file__).parent / "_stats.json"), str(novel_stats_file))

    # Retry 2 times. If it crash it is reset to default and retried.
    for _ in range(2):
        try :
            with open(novel_stats_file, "r", encoding="utf-8") as f:
                novel_stats = json.load(f)
                clicks = novel_stats["clicks"]
                ratings = novel_stats["ratings"] if "ratings" in novel_stats else {}
                comment_count = novel_stats["comment_count"] 
                source_ratings = novel_stats["source_ratings"]

        except Exception as e:
            print(f"Resetting novel stats for {novel_folder.name}: {e}")
            shutil.copyfile("./lncrawl/bots/web2/flask_api/_stats.json", novel_stats_file)
            continue

        break

    # endregion
    # region Load Sources
    path = novel_folder.absolute()

    tags = set()
    sources = []
    language: set[str] = set()

    for source_folder in novel_folder.iterdir():
        if not source_folder.is_dir():
            continue

        source = _get_source_info(source_folder)
        if not source:
            continue

        source.source_rating = (
            source_ratings[source.slug] if source.slug in source_ratings else 0
        )

        if not source:
            continue

        if source.tags:
            tags.update(source.tags)

        if source.language:
            language.add(source.language)

        sources.append(source)

    language = ", ".join(language)

    # endregion

    # region Set Novel Info from Sources
    cover = None
    prefered_source = None
    author = ""
    chapter_count = 0
    latest = ""
    first = ""
    volume_count = 0
    title = ""
    summary = ""

    for source in sorted(sources, key=lambda x: x.source_rating, reverse=True):
        if not prefered_source:
            prefered_source = source

        if not cover:
            cover = source.cover

        if not author:
            author = source.author

        if not chapter_count:
            chapter_count = source.chapter_count

        if not latest:
            latest = source.latest

        if not first:
            first = source.first

        if not volume_count:
            volume_count = source.volume_count

        if not title:
            title = source.title

        if not summary:
            summary = source.summary

    if not title:
        title = novel_folder.name

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
        tags=tags,
        language=language,
        clicks=clicks,
        rank=None,
        prefered_source=prefered_source,
        sources=sources,
        ratings=ratings,
        comment_count=comment_count,
    )

    # endregion

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
        if "novel" in data:
            novel_metadata = data["novel"]
        else:
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
    author = (
        novel_metadata["author"]
        if "author" in novel_metadata
        else novel_metadata["authors"]
        if "authors" in novel_metadata
        else ""
    )
    if isinstance(author, list):
        author = ", ".join(author)
    chapter_count = (
        len(novel_metadata["chapters"]) if "chapters" in novel_metadata else 0
    )
    volume_count = len(novel_metadata["volumes"]) if "volumes" in novel_metadata else 0
    title = (
        novel_metadata["title"]
        if "title" in novel_metadata
        else source_folder.parent.name
    )
    language = novel_metadata["language"] if "language" in novel_metadata else "en"
    url = novel_metadata["url"] if "url" in novel_metadata else ""
    # Multiple ternary for backward compatibility
    summary = (
        novel_metadata["synopsis"]
        if "synopsis" in novel_metadata
        else novel_metadata["summary"]
        if "summary" in novel_metadata
        else ""
    )
    tags = (
        novel_metadata["novel_tags"]
        if "novel_tags" in novel_metadata
        else novel_metadata["tags"]
        if "tags" in novel_metadata
        else []
    )

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
        tags=tags,
        language=language,
        url=url,
        last_update_date=last_update_date,
    )

    return source

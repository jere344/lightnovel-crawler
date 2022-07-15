from flask import request, send_from_directory
from . import lib
from . import flaskapp
from . import database
from . import utils
import pathlib
import math
from urllib.parse import unquote_plus
import json


@flaskapp.app.route("/api/image/<path:file>")
def image(file: pathlib.Path):
    path: pathlib.Path = lib.LIGHTNOVEL_FOLDER / file
    if path.exists():
        return send_from_directory(lib.LIGHTNOVEL_FOLDER, file)
    else:
        print(path)
    return "", 404


@flaskapp.app.route("/api/flags/<string:language>")
def flags(language: str):
    if not len(language) == 2:
        return "", 404

    return send_from_directory("static/flags", language + ".svg")


# /api/novels?page=${page}
@flaskapp.app.route("/api/novels")
def get_novels():
    page = request.args.get("page")
    if not page:
        page = 0

    start = int(page) * 20
    stop = (int(page) + 1) * 20
    content = {
        (int(page) * 20 + 1 + i): e.asdict()
        for i, e in enumerate(database.all_downloaded_novels[start:stop])
    }
    return {
        "content": content,
        "metadata": {
            "total_pages": math.ceil(len(database.all_downloaded_novels) / 20),
            "current_page": int(page),
        },
    }


@flaskapp.app.route("/api/novel")
def get_novel():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    if not novel_slug or not source_slug:
        return "", 404

    source_path = (
        lib.LIGHTNOVEL_FOLDER / unquote_plus(novel_slug) / unquote_plus(source_slug)
    )
    source = utils.find_source_with_path(source_path)
    if not source_path.exists():
        return "", 404

    return source.asdict()


@flaskapp.app.route("/api/chapter/")
def get_chapter():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    chapter_id = request.args.get("chapter")
    if not novel_slug or not source_slug or not chapter_id:
        return "novel, source or chapter missing : invalid request", 400
    chapter_folder = (
        lib.LIGHTNOVEL_FOLDER
        / unquote_plus(novel_slug)
        / unquote_plus(source_slug)
        / "json"
    )
    chapter_path = chapter_folder / f"{str(chapter_id).zfill(5)}.json"
    with open(chapter_path, "r") as f:
        chapter = json.load(f)

    if not chapter_path.exists():
        return "", 404

    is_next = (chapter_folder / f"{str(int(chapter_id) + 1).zfill(5)}.json").exists()
    is_prev = (chapter_folder / f"{str(int(chapter_id) - 1).zfill(5)}.json").exists()

    source = utils.find_source_with_path(chapter_folder.parent)

    return {
        "content": chapter,
        "is_next": is_next,
        "is_prev": is_prev,
        "source": source.asdict(),
    }

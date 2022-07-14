from flask import request, send_from_directory
from . import lib
from . import flaskapp
from . import database
from . import utils
import pathlib
import math
from urllib.parse import unquote_plus


@flaskapp.app.route("/api/image/<path:file>")
def image(file: pathlib.Path):
    path: pathlib.Path = lib.LIGHTNOVEL_FOLDER / file
    if path.exists() and path.name == "cover.jpg":
        return send_from_directory(lib.LIGHTNOVEL_FOLDER, file)
    else:
        print(path)
        print(path.name)
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


@flaskapp.app.route("/api/novel/<string:novel_slug>/<string:source_slug>")
def get_novel(novel_slug: str, source_slug: str):
    source_path = (
        lib.LIGHTNOVEL_FOLDER / unquote_plus(novel_slug) / unquote_plus(source_slug)
    )
    source = utils.find_source_with_path(source_path)
    if not source_path.exists():
        return "", 404

    return source.asdict()

from typing import List
from .Novel import Novel
from . import flaskapp
from flask import request
import json
from . import lib
from . import utils
import uuid
from . import datetools
from . import sanatize
import urllib.parse
from . import naming_rules
from . import discord_bot

def get_newest_comments(url: str, count: int = 5, offset: int = 0):
    """Get the newest comments for a novel
    return list of files
    """
    path = get_path_from_url(url)
    if not path.exists():
        return []

    directory = path.parent

    # Get all files in the directory and sort them by modification time (newest first)
    files = sorted(
        directory.glob("[0-9][0-9][0-9][0-9][0-9].json"),
        key=lambda f: f.stat().st_mtime,
        reverse=True,
    )

    return [x.name for x in files[offset : offset + count]]


def get_path_from_url(url: str):
    """Get the path to the comment file from the url

    /novel/Under+The+Oak+Tree/novelnext-com -> lib.COMMENT_FOLDER / Under The Oak Tree.json
    /novel/Under+The+Oak+Tree/novelnext-com/chapter-1 -> lib.COMMENT_FOLDER / Under The Oak Tree / 00001.json

    """

    url = (
        url.replace("https://", "").replace("http://", "").replace("\\", "/").split("/")
    )
    url = [x for x in url if x != ""]  # remove empty strings

    if url[0] != "novel" and url[0] != "chat":
        return None
    if len(url) == 3:  # novel info page
        url_1 = naming_rules.clean_name(sanatize.pathify(url[1]))
        path = lib.COMMENT_FOLDER / url_1 / f"{url_1}.json"
    elif len(url) == 4:  # chapter page
        chap_number = url[3].split("-")[-1]
        path = (
            lib.COMMENT_FOLDER
            / naming_rules.clean_name(sanatize.pathify(url[1]))
            / f"{chap_number.zfill(5)}.json"
        )
    else:
        return None

    return path


def get_source_from_url(url: str):
    """Get the source from the url"""
    url = (
        url.replace("https://", "").replace("http://", "").replace("\\", "/").split("/")
    )
    url = [x for x in url if x != ""]
    if len(url) == 3 or len(url) == 4:
        return url[2]


def prepare_comments(comments: dict):
    """Recursively prepare the comment data to send to the client"""
    for comment in comments:
        comment["likes"] = len(comment["likes"])
        comment["dislikes"] = len(comment["dislikes"])

        prepare_comments(comment["replies"])


def _find_comment(comments: List[dict], comment_id: str):
    """Recursively find a comment"""
    for comment in comments:
        if comment["id"] == comment_id:
            return comment
        found = _find_comment(comment["replies"], comment_id)
        if found:
            return found
    return None


def find_comment(comments: dict, comment_id: str):
    """Find a comment in a file"""
    for source in comments:
        comment = _find_comment(comments[source], comment_id)
        if comment:
            return comment
    return None


@flaskapp.app.route("/api/get_comments")
@flaskapp.app.route("/get_comments")
def get_comments():
    url = request.args.get("page")
    if not url:
        return {"status": "error", "message": "No page specified"}, 400

    path = get_path_from_url(url)

    if not path.exists():
        return {
            "status": "success",
            "content": [],
            "adjacent": [],
            # "not_loaded": [],
        }, 200

    with open(path, "r", encoding="utf-8") as f:
        comments = json.load(f)

    source = get_source_from_url(url)
    if not source in comments:
        comments[source] = []

    for s in comments:
        prepare_comments(comments[s])

    content = comments[source]
    comments[source] = []

    # not_loaded = get_newest_comments(url, 5, 0)
    # print(not_loaded)

    return {
        "status": "success",
        "content": content,
        "adjacent": comments,
        # "not_loaded": not_loaded,
    }, 200


@flaskapp.app.route("/api/add_comment", methods=["POST"])
@flaskapp.app.route("/add_comment", methods=["POST"])
def add_comment():
    data = request.get_json()

    url = data.get("page")
    name = data.get("name")
    text = data.get("text")
    spoiler = data.get("spoiler")
    if not url or not name or not text:
        return {"status": "error", "message": "Missing data"}, 400
    url = urllib.parse.unquote(url)

    requester_ip = request.environ.get("HTTP_X_REAL_IP", request.remote_addr)
    print(f"Requester IP: {requester_ip}")

    reply = {
        "name": name,
        "text": text,
        "date": datetools.utc_str_date(),
        "id": str(uuid.uuid4()),
        "rank": "Reader" if requester_ip != "127.0.0.1" else "Owner",
        "spoiler": True if spoiler else False,
        "reply_to": None,
        "likes": [],
        "dislikes": [],
        "replies": [],
    }

    path = get_path_from_url(url)

    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            json.dump({}, f)
    with open(path, "r", encoding="utf-8") as f:
        comments = json.load(f)

    comment_id_to_reply_to = data.get("reply_to")
    if comment_id_to_reply_to:
        reply["reply_to"] = comment_id_to_reply_to
        comment_to_reply_to = find_comment(comments, comment_id_to_reply_to)
        if comment_to_reply_to:
            comment_to_reply_to["replies"].append(reply)
        else:
            return {"status": "error", "message": "Comment not found"}, 400

    else:
        source = get_source_from_url(url)
        if not source in comments:
            comments[source] = []
        comments[source].append(reply)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(comments, f)

    novel: Novel = utils.get_novel_with_url(url)
    if novel:
        novel.comment_count += 1

    print(f"Comment added to {url} by {name} ({text})")

    discord_bot.bot.send_comment(name, text, lib.WEBSITE_URL + url)

    return {"status": "success"}, 200


@flaskapp.app.route("/api/add_reaction", methods=["POST"])
@flaskapp.app.route("/add_reaction", methods=["POST"])
def rate_comment():
    """Like or dislike a comment"""
    data = request.get_json()
    url = data.get("page")
    comment_id = data.get("comment_id")
    reaction = data.get("reaction")

    if not url or not comment_id:
        return {"status": "error", "message": "Missing data"}, 400

    path = get_path_from_url(url)

    if not path.exists():
        return {"status": "error", "message": "Comment not found"}, 400

    with open(path, "r", encoding="utf-8") as f:
        comments = json.load(f)

    comment = find_comment(comments, comment_id)
    if not comment:
        return {"status": "error", "message": "Comment not found"}, 400

    shuffled_ip = utils.shuffle_ip(
        request.environ.get("HTTP_X_REAL_IP", request.remote_addr)
    )
    if reaction == "like":
        if shuffled_ip in comment["dislikes"]:
            comment["dislikes"].remove(shuffled_ip)
        if shuffled_ip not in comment["likes"]:
            comment["likes"].append(shuffled_ip)

    elif reaction == "dislike":
        if shuffled_ip in comment["likes"]:
            comment["likes"].remove(shuffled_ip)
        if shuffled_ip not in comment["dislikes"]:
            comment["dislikes"].append(shuffled_ip)

    elif reaction == "none":
        if shuffled_ip in comment["likes"]:
            comment["likes"].remove(shuffled_ip)
        if shuffled_ip in comment["dislikes"]:
            comment["dislikes"].remove(shuffled_ip)

    with open(path, "w", encoding="utf-8") as f:
        json.dump(comments, f)

    return {"status": "success"}, 200

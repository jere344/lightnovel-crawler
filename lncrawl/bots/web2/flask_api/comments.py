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


def prepare_comments(comments: dict):
    """Recursively prepare the comment data to send to the client"""
    for comment in comments:
        comment["likes"] = len(comment["likes"])
        comment["dislikes"] = len(comment["dislikes"])

        prepare_comments(comment["replies"])


def find_comment(comments: List[dict], comment_id: str):
    """Recursively find a comment"""
    for comment in comments:
        if comment["id"] == comment_id:
            return comment
        found = find_comment(comment["replies"], comment_id)
        if found:
            return found
    return None


@flaskapp.app.route("/get_comments")
def get_comments():
    url = request.args.get("page")
    if not url:
        return {"status": "error", "message": "No page specified"}, 400

    path = lib.COMMENT_FOLDER / f"{sanatize.pathify(url)}.json"

    if not path.exists():
        return {"status": "success", "content": []}, 200

    with open(path, "r", encoding='utf-8') as f:
        comments = json.load(f)

    prepare_comments(comments)

    return {"status": "success", "content": comments}, 200


@flaskapp.app.route("/add_comment", methods=["POST"])
def add_comment():
    data = request.get_json()

    url = data.get("page")
    name = data.get("name")
    text = data.get("text")
    spoiler = data.get("spoiler")
    if not url or not name or not text:
        return {"status": "error", "message": "Missing data"}, 400

    reply = {
        "name": name,
        "text": text,
        "date": datetools.utc_str_date(),
        "id": str(uuid.uuid4()),
        "rank": "Reader",
        "spoiler": True if spoiler else False,
        "reply_to": None,
        "likes": [],
        "dislikes": [],
        "replies": [],
    }

    path = (
        lib.COMMENT_FOLDER / f"{sanatize.pathify(urllib.parse.unquote_plus(url))}.json"
    )
    if not path.exists():
        with open(path, "w", encoding='utf-8') as f:
            json.dump([], f)
    with open(path, "r", encoding='utf-8') as f:
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
        comments.append(reply)

    with open(path, "w", encoding='utf-8') as f:
        json.dump(comments, f)

    novel: Novel = utils.get_novel_with_url(url)
    novel.comment_count += 1

    return {"status": "success"}, 200


@flaskapp.app.route("/add_reaction", methods=["POST"])
def rate_comment():
    """Like or dislike a comment"""
    data = request.get_json()
    url = data.get("page")
    comment_id = data.get("comment_id")
    reaction = data.get("reaction")

    if not url or not comment_id:
        return {"status": "error", "message": "Missing data"}, 400

    path = (
        lib.COMMENT_FOLDER / f"{sanatize.pathify(urllib.parse.unquote_plus(url))}.json"
    )

    if not path.exists():
        return {"status": "error", "message": "Comment not found"}, 400

    with open(path, "r", encoding='utf-8') as f:
        comments = json.load(f)

    comment = find_comment(comments, comment_id)
    if not comment:
        return {"status": "error", "message": "Comment not found"}, 400

    ip = utils.shuffle_ip(request.remote_addr)
    if reaction == "like":
        if ip in comment["dislikes"]:
            comment["dislikes"].remove(ip)
        if ip not in comment["likes"]:
            comment["likes"].append(ip)

    elif reaction == "dislike":
        if ip in comment["likes"]:
            comment["likes"].remove(ip)
        if ip not in comment["dislikes"]:
            comment["dislikes"].append(ip)

    elif reaction == "none":
        if ip in comment["likes"]:
            comment["likes"].remove(ip)
        if ip in comment["dislikes"]:
            comment["dislikes"].remove(ip)

    with open(path, "w", encoding='utf-8') as f:
        json.dump(comments, f)

    return {"status": "success"}, 200

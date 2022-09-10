from typing import List
from . import flaskapp
from flask import request
import json
from . import lib
from . import utils
import uuid
import datetime
from . import sanatize


def prepare_comments(comments: dict):
    """Recursively prepare the comment data to send to the client"""
    for comment in comments:
        comment["likes"] = len(comment["likes"])
        comment["dislikes"] = len(comment["dislikes"])

        comment["replies"] = prepare_comments(comment["replies"])


def find_comment(comments: List[dict], comment_id: str):
    """Recursively find a comment"""
    for comment in comments:
        if comment["id"] == comment_id:
            return comment
        found = find_comment(comment["replies"], comment_id)
        if found:
            return found
    return None


@flaskapp.app.route("/api/get_comments")
def get_comments():
    url = request.args.get("page")
    if not url:
        return "Invalid request", 400

    path = lib.COMMENT_FOLDER / f"{sanatize.pathify(url)}.json"
    print(path)

    if not path.exists():
        return {"content": []}, 200

    with open(lib.COMMENT_FOLDER / f"{sanatize.pathify(url)}.json", "r") as f:
        comments = json.load(f)

    prepare_comments(comments)

    return {"content": comments}, 200


@flaskapp.app.route("/api/add_comment", methods=["POST"])
def add_comment():
    data = request.get_json()

    url = data.get("page")
    name = data.get("name")
    text = data.get("text")
    spoiler = data.get("spoiler")
    if not url or not name or not text:
        return "Invalid request", 400

    reply = {
        "name": name,
        "text": text,
        "date": datetime.datetime.now().isoformat(),
        "id": str(uuid.uuid4()),
        "rank": "Reader",
        "spoiler": spoiler,
        "likes": {},
        "dislikes": {},
        "replies": [],
        "reply_to": None,
    }

    path = lib.COMMENT_FOLDER / f"{sanatize.pathify(url)}.json"
    if not path.exists():
        with open(path, "w") as f:
            json.dump([], f)
    with open(path, "r") as f:
        comments = json.load(f)

    comment_id_to_reply_to = data.get("reply")
    if comment_id_to_reply_to:
        reply.reply_to = comment_id_to_reply_to
        comment_to_reply_to = find_comment(comments, comment_id_to_reply_to)
        if comment_to_reply_to:
            comment_to_reply_to["replies"].append(reply)
        else:
            return "Invalid request", 400

    else:
        comments.append(reply)

    with open(path, "w") as f:
        json.dump(comments, f)

    return "success", 200


@flaskapp.app.route("/api/rate_comment", methods=["POST"])
def rate_comment():
    """Like or dislike a comment"""
    data = request.get_json()
    url = data.get("page")
    comment_id = data.get("comment_id")
    rating = data.get("rating")

    if not url or not comment_id or not rating:
        return "Invalid request", 400

    path = lib.COMMENT_FOLDER / f"{sanatize.pathify(url)}.json"

    if not path.exists():
        return "Invalid request", 400

    with open(path, "r") as f:
        comments = json.load(f)

    comment = find_comment(comments, comment_id)
    if not comment:
        return "Invalid request", 400

    ip = utils.shuffle_ip(request.remote_addr)
    if rating == "like":
        if ip in comment["dislikes"]:
            comment["dislikes"].remove(ip)
        if ip not in comment["likes"]:
            comment["likes"].append(ip)

    elif rating == "dislike":
        if ip in comment["likes"]:
            comment["likes"].remove(ip)
        if ip not in comment["dislikes"]:
            comment["dislikes"].append(ip)

    with open(path, "w") as f:
        json.dump(comments, f)

    return "Success", 200

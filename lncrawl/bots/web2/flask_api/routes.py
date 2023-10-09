from flask import request, send_from_directory, send_file, make_response
from . import lib
from . import flaskapp
from . import database
from . import utils
import math
from urllib.parse import unquote_plus
import json
from typing import List
from .Novel import Novel
import difflib
from . import sanatize
import os
from . import naming_rules

@flaskapp.app.route("/api/image/<path:file>")
@flaskapp.app.route("/image/<path:file>")
def image(file: str):
    path = os.path.join(lib.LIGHTNOVEL_FOLDER, file)

    if not os.path.realpath(path).startswith(os.path.realpath(lib.LIGHTNOVEL_FOLDER)):
        return 403

    if os.path.exists(path) :
        return send_from_directory(lib.LIGHTNOVEL_FOLDER, file), 200
    else :
        temp = file.split("/") 
        alt_file = naming_rules.clean_name(temp[0]) + "/" + "/".join(temp[1:])
        alt_path = os.path.join(
            lib.LIGHTNOVEL_FOLDER, 
            alt_file
        )
        if os.path.exists(alt_path):
            return send_from_directory(lib.LIGHTNOVEL_FOLDER, alt_file), 200
        
        else :
            if (
                file.endswith("/cover.min.jpg") and 
                os.path.exists(path.replace("/cover.min.jpg", "/cover.jpg"))
            ):
                utils.create_miniature(path.replace("/cover.min.jpg", "/cover.jpg"), path, 200)
            
            elif (
                file.endswith("/cover.sm.jpg") and 
                os.path.exists(path.replace("/cover.sm.jpg", "/cover.jpg"))
            ):
                utils.create_miniature(path.replace("/cover.sm.jpg", "/cover.jpg"), path, 500)
            
            else :
                return send_from_directory("static/assets",  "404.svg"), 200
    
        return send_from_directory(lib.LIGHTNOVEL_FOLDER, file), 200

    

@flaskapp.app.route("/api/flags/<string:language>")
@flaskapp.app.route("/flags/<string:language>")
def flags(language: str):
    if not len(language) == 2:
        return "", 404

    return send_from_directory("static/flags", language + ".svg"), 200


@flaskapp.app.route("/api/novels")
@flaskapp.app.route("/novels")
def get_novels():
    """
    :number: The number of novels to return / the number of novel per page
    :page: Page number
    :sort: Sort by [rank, views, title, author, rating...] (default: rank)
    :tags: Tags to filter by (comma separated) (-tag to exclude)

    """
    page = request.args.get("page")
    if not page or not page.isdigit():
        page = 0

    number = request.args.get("number")
    if not number or not number.isdigit():
        number = 20

    sort = request.args.get("sort")
    if not sort: # will be validated later
        sort = "rank"
    
    tags = request.args.get("tags")
    if tags:
        tags = [("-" if t.startswith("-") else "") + sanatize.sanitize(t) for t in tags.split(",")]

    page = int(page)
    number = int(number)

    start = page * number
    stop = (page + 1) * number

    novels = []
    total_pages = 0

    try :
        if not tags:
            novels = database.sorted_all_novels[sort]()[start:stop]
            total_pages = math.ceil(len(database.all_novels) / number)

        else:
            filtered_novels:List[Novel] = [novel for novel in database.sorted_all_novels[sort]() if utils.has_tags(novel, tags)]
            novels = filtered_novels[start:stop]
            total_pages = math.ceil(len(filtered_novels) / number) 

    except KeyError:
        return "Invalid sort", 400

    

    return {
        "content": {
                (page * number + 1 + i): e.asdict()
                for i, e in enumerate(novels)
        },
        "metadata": {
            "total_pages": total_pages,
            "current_page": page,
        },
    }, 200



@flaskapp.app.route("/api/sources")
@flaskapp.app.route("/sources")
def get_sources():
    """
    :number: The number of sources to return / the number of source per page
    :page: Page number
    :sort: Sort by [rank, views, title, author, rating...] (default: rank)
    :tags: Tags to filter by (comma separated) (-tag to exclude)

    """
    page = request.args.get("page")
    if not page or not page.isdigit():
        page = 0

    number = request.args.get("number")
    if not number or not number.isdigit():
        number = 20

    sort = request.args.get("sort")
    if not sort: # will be validated later
        sort = "last_updated"
    
    tags = request.args.get("tags")
    if tags:
        tags = [sanatize.sanitize(t) for t in tags.split(",")]

    page = int(page)
    number = int(number)

    start = page * number
    stop = (page + 1) * number

    sources = []
    total_pages = 0

    try :
        if not tags:
            sources = database.sorted_all_sources[sort]()[start:stop]
            total_pages = math.ceil(len(database.all_sources) / number)

        else:
            filtered_sources = [source for source in database.all_sources if utils.has_tags(source.novel, tags)]
            sources = filtered_sources[start:stop]
            total_pages = math.ceil(len(filtered_sources) / number) 

    except KeyError:
        return "Invalid sort", 400

    

    return {
        "content": {
                (page * number + 1 + i): e.asdict()
                for i, e in enumerate(sources)
        },
        "metadata": {
            "total_pages": total_pages,
            "current_page": page,
        },
    }, 200

from . import datetools

@flaskapp.app.route("/api/novel")
@flaskapp.app.route("/novel")
def get_novel():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    if not novel_slug or not source_slug:
        return "", 404

    source_path = (
        lib.LIGHTNOVEL_FOLDER / unquote_plus(novel_slug) / unquote_plus(source_slug)
    )
    source = utils.find_source_with_path(source_path)
    if not source:
        return "", 404

    current_week = datetools.current_week()
    if current_week not in source.novel.clicks:
        source.novel.clicks[current_week] = 0

    source.novel.clicks[current_week] += 1

    return source.asdict(), 200

@flaskapp.app.route("/api/chapter/")
@flaskapp.app.route("/chapter/")
def get_chapter():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    chapter_id = int(request.args.get("chapter"))
    if not novel_slug or not source_slug or not chapter_id:
        return "invalid request : novel, source or chapter missing", 400
    
    source = utils.get_source_with_slugs(novel_slug, source_slug)
    if not source:
        return "Unknown or unauthorized file", 404

    chapter_folder = source.path / "json"

    chapter_path = chapter_folder / f"{str(chapter_id).zfill(5)}.json"
    if not os.path.exists(chapter_path) or not os.path.realpath(chapter_path).startswith(os.path.realpath(lib.LIGHTNOVEL_FOLDER)):
        return "Unknown or unauthorized file", 404


    with open(chapter_path, "r", encoding='utf-8') as f:
        chapter = json.load(f)

    if not chapter_path.exists():
        return "", 404

    is_next = (chapter_folder / f"{str(int(chapter_id) + 1).zfill(5)}.json").exists()
    is_prev = (chapter_folder / f"{str(int(chapter_id) - 1).zfill(5)}.json").exists()

    current_week = datetools.current_week()
    if current_week not in source.novel.clicks:
        source.novel.clicks[current_week] = 0

    source.novel.clicks[current_week] += 1

    return {
        "content": chapter,
        "is_next": is_next,
        "is_prev": is_prev,
        "source": source.asdict(),
    }, 200

@flaskapp.app.route("/api/chapterlist/")
@flaskapp.app.route("/chapterlist/")
def get_chapter_list():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    page = request.args.get("page")
    if not novel_slug or not source_slug:
        return "invalid request : novel or source missing", 400
    if not page:
        page = 1
    page = int(page) - 1

    source = utils.get_source_with_slugs(novel_slug, source_slug)
    if not source:
        return "Unknown or unauthorized file", 404
    meta_file = source.path / "meta.json"
    
    if not os.path.exists(meta_file) or not os.path.realpath(meta_file).startswith(os.path.realpath(lib.LIGHTNOVEL_FOLDER)):
        return "Unknown or unauthorized file", 404

    current_week = datetools.current_week()
    if current_week not in source.novel.clicks:
        source.novel.clicks[current_week] = 0

    source.novel.clicks[current_week] += 1

    with open(meta_file, "r", encoding='utf-8') as f:
        data = json.load(f)
        # For backward compatibility
        if "novel" in data:
            chapter_list = data["novel"]["chapters"]
        else:
            chapter_list = data["chapters"]

    start = page * 100
    stop = min((page + 1) * 100, len(chapter_list) + 1)

    is_next = (page + 1) * 100 < len(chapter_list)
    is_prev = page > 0
    total_pages = math.ceil(len(chapter_list) / 100)

    return {
        "content": chapter_list[start:stop],
        "source": source.asdict(),
        "is_next": is_next,
        "is_prev": is_prev,
        "total_pages": total_pages,
    }, 200

@flaskapp.app.route("/api/search/")
@flaskapp.app.route("/search/")
def search():
    """
    => return a list of max 20 best matches from downloaded novels
    """
    query = request.args.get("query")

    if not query or len(query) < 3:
        return "Invalid query", 400

    query = sanatize.sanitize(query).split(" ")
    ratio: List[tuple[Novel, int]] = []

    for novel in database.all_novels:
        count = 0
        for query_search_word in query:
            similarity_found = False
            # We check if each query word is in the novel keywords or similar to one of them
            for downloaded_search_word in novel.search_words:
                if difflib.SequenceMatcher(None, query_search_word, downloaded_search_word).ratio() > 0.75:
                    # test similarity : slime and lime are similar
                    similarity_found = True
                    break
                elif query_search_word in downloaded_search_word:
                    # But if a word is long : awak and awakening are not similar
                    # but awakening should be counted for awak so we check if the word is in the downloaded word
                    similarity_found = True
                    break

                # Sadly long words not written completly with a small mistakae will not be counted
                # like : aawaken and awakening
            
            # A word similar to a novel keyword is worth less than a word not in the novel
            if similarity_found:
                count += 1
            else :
                count -= 2
        if count > 0:
            ratio.append((novel, count))

    ratio.sort(key=lambda x: x[1], reverse=True)

    number_of_results = min(20, len(database.all_novels))

    search_results = [
        novel.asdict() for novel, ratio in ratio[:number_of_results] if ratio != 0
    ]

    return {
        "content": search_results,
        "results": number_of_results,
    }, 200

@flaskapp.app.route("/api/rate", methods=["POST"])
@flaskapp.app.route("/rate", methods=["POST"])
def rate():

    data = request.get_json()

    novel_slug = data.get("novel")
    rating = int(data.get("rating"))

    if not 0 < rating < 6:
        return {"status": "error", "message": "Rating must be between 1 and 5"}, 400

    novel = utils.get_novel_with_slug(novel_slug)

    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    novel.ratings[utils.shuffle_ip(ip)] = rating

    print(f"Rating added for {novel_slug} : {rating} (from {ip})")

    return {"status": "success", "message": "Rating added"}, 200

@flaskapp.app.route("/api/rate_source", methods=["POST"])
@flaskapp.app.route("/rate_source", methods=["POST"])
def rate_source():
    data = request.get_json()
    novel_slug = data.get("novel")
    source_slug = data.get("source")
    rating = int(data.get("rating"))


    if not rating in [-1, 1]:
        print("a")
        return {"status": "error", "message": "Rating must be -1 or 1"}, 400
    
    novel = utils.get_novel_with_slug(novel_slug)
    if not novel:
        return {"status": "error", "message": "Unknown novel"}, 404
    
    source = utils.get_source_with_slugs(novel_slug, source_slug)
    if not source:
        return {"status": "error", "message": "Unknown source"}, 404

    source.source_rating += rating

    # ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    # print(f"Rating added for {novel_slug} : {rating} (from {ip})")

    return {"status": "success", "message": "Rating added"}, 200

@flaskapp.app.route("/api/toptags")
@flaskapp.app.route("/toptags")
def toptags():
    return {"content": database.top_tags}, 200

@flaskapp.app.route("/api/searchtags")
@flaskapp.app.route("/searchtags")
def searchtags():
    query = request.args.get("query")
    if not query or len(query) < 3:
        return "Invalid query", 400
    
    query = sanatize.sanitize(query)

    results = []
    for key, value in database.all_tags.items():
        if query in key:
            results.append((key, value[1]))
    
    results.sort(key=lambda x: x[1], reverse=True)

    return {"content": results}, 200

@flaskapp.app.route("/api/sitemap.xml")
@flaskapp.app.route("/sitemap.xml")
def sitemap():
    response = make_response(send_file(lib.sitemap_file.absolute()), 200)
    response.headers["Content-Type"] = "application/xml"
    response.charset = "utf-8"
    return response


@flaskapp.app.route("/api/ebook")
@flaskapp.app.route("/ebook")
def ebook():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    ebook_format = request.args.get("format")

    if not novel_slug or not source_slug or not ebook_format:
        return "Missing parameter", 400
    
    if ebook_format not in ["epub"]:
        return "Invalid ebook format", 400
    

    folder_path = lib.LIGHTNOVEL_FOLDER / novel_slug / source_slug / ebook_format
    if not folder_path.exists() or not os.path.realpath(folder_path).startswith(os.path.realpath(lib.LIGHTNOVEL_FOLDER)):
        return "Unknown or unauthorized file", 404
    
    # We assume that the file is the only one in the folder
    for file in folder_path.glob(f"*.{ebook_format}"):
        return send_file(file.absolute(), as_attachment=True), 200
    

@flaskapp.app.route("/api/search_tags")
@flaskapp.app.route("/search_tags")
def search_tags():
    """
    return a list of tags matching the query
    :param query: the query to search, must be at least 3 characters long
    :return: list of tuple (tag, number of novels with this tag)
    """
    query = request.args.get("query")
    if not query or len(query) > 100:
        return "Invalid query", 400
    
    query = sanatize.sanitize(query)

    results = []
    for key, value in database.all_tags.items():
        if query in key:
            results.append(value)
    
    results.sort(key=lambda x: x[1], reverse=True)

    return {"content": results}, 200

@flaskapp.app.route("/api/download")
@flaskapp.app.route("/download")
def download():
    novel_slug = request.args.get("novel")
    source_slug = request.args.get("source")
    ebook_format = request.args.get("format") 

    if not novel_slug or not source_slug or not ebook_format:
        return "Missing parameter, need : novel, source and format", 400
    
    
    ebook_folder = (
        lib.LIGHTNOVEL_FOLDER
        / unquote_plus(novel_slug)
        / unquote_plus(source_slug)
        / ebook_format
    )
    # We assume that the file is the only one in the folder
    ebook = next(ebook_folder.glob(f"*.{ebook_format}") , None)


    if not ebook or not os.path.realpath(ebook).startswith(os.path.realpath(lib.LIGHTNOVEL_FOLDER)):
        return "Unknown or unauthorized file", 404


    return send_file(ebook.absolute(), as_attachment=True), 200

import random

@flaskapp.app.route("/api/featured")
@flaskapp.app.route("/featured")
def featured():
    """Return the featured source"""
    featured_novel : Novel = database.sorted_all_novels["rank"]()[random.randint(0, 2)] 
    return featured_novel.prefered_source.asdict(), 200
    
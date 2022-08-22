from ..flaskapp import app
from flask import redirect, request, render_template
from .. import lib
from .. import database
from .Job import JobHandler, FinishedJob
import random

# ----------------------------------------------- Search Novel ----------------------------------------------- #


@app.route(
    "/api/addnovel/search/",
)
def search_form():
    query = request.args.get("query")
    job_id = request.args.get("job_id")

    if not query:
        return {"status": "error", "message": "No query"}
    if len(query) < 4:
        return {"status": "error", "message": "Query too short"}, 400

    if not job_id:
        while True:
            job_id = random.randint(1, 1000000)
            if job_id not in database.jobs:
                break

    if isinstance(database.jobs[job_id], JobHandler):
        return {"status": "error", "message": "Job already exists"}, 400

    database.jobs[job_id] = job = JobHandler(job_id)

    job.get_list_of_novel(query)

    return {"status": "success"}, 200


# ----------------------------------------------- Choose Novel ----------------------------------------------- #


@app.route("/lncrawl/addnovel/choose_novel/")
def novel_select_page():
    """Return search results"""
    job_id = request.args.get("job_id")

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 400

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 200

    if isinstance(job, FinishedJob):
        return {
            "status": "error",
            "message": f"Job aldready finished : {job.get_status()}",
        }, 400

    if not job.search_results:
        return {"status": "error", "message": "No search results"}, 400

    return {"status": "success", "novels": job.search_results}, 200


# ----------------------------------------------- Choose Source ----------------------------------------------- #


@app.route("/lncrawl/addnovel/choose_source/")
def novel_selected():
    """Return list of sources for selected novel"""
    job_id = request.args.get("job_id")
    novel_id = request.args.get("novel_id")

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 400

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 200

    if isinstance(job, FinishedJob):
        return {
            "status": "error",
            "message": f"Job aldready finished : {job.get_status()}",
        }, 400

    job.select_novel(novel_id)

    return {"status": "success", "sources": job.get_list_of_sources()}, 200


# ----------------------------------------------- Start Download ----------------------------------------------- #


@app.route("/lncrawl/addnovel/download/")
def download():
    """Select Source and start download"""
    job_id = request.args.get("job_id")
    novel_id = request.args.get("novel_id")
    source_id = request.args.get("source_id")

    if not job_id in database.jobs:
        return {"status": "error", "message": "Job do not exist"}, 400

    job = database.jobs[job_id]
    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 200

    if isinstance(job, FinishedJob):
        return {
            "status": "error",
            "message": f"Job aldready finished : {job.get_status()}",
        }, 400

    if not job.metadata_downloaded:
        job.select_novel(novel_id)
        job.select_source(source_id)
        return {"status": "pending", "message": job.get_status()}, 200

    job.start_download()

    return {"status": "pending", "message": job.get_status()}, 200


# ----------------------------------------------- Direct Download ----------------------------------------------- #


@app.route("/lncrawl/addnovel/direct_download/")
def direct_download():
    """Directly download a novel using the novel url"""

    job_id = request.args.get("job_id")

    novel_url = request.args.get("url")
    if not novel_url:
        return {"status": "error", "message": "Missing url"}, 400
    if not novel_url.startswith("http"):
        {"status": "error", "message": "Invalid URL"}

    if not job_id in database.jobs or (
        isinstance(database.jobs[job_id], FinishedJob)
        and database.jobs[job_id].original_query != novel_url
    ):
        database.jobs[job_id] = job = JobHandler(job_id)
    else:
        job = database.jobs[job_id]

    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 200

    if isinstance(job, FinishedJob):
        return {"status": "success", "message": job.get_status()}, 200

    if not job.metadata_downloaded:
        job.prepare_direct_download(novel_url)
        return {"status": "pending", "message": job.get_status()}, 200

    job.start_download()

    return {"status": "pending", "html": job.get_status()}, 200

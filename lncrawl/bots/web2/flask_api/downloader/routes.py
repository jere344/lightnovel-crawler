from ..flaskapp import app
from flask import request
from .. import database
from .Job import JobHandler, FinishedJob

# ----------------------------------------------- Search Novel ----------------------------------------------- #


@app.route("/api/addnovel/search")
def addnovel():
    """Create session"""
    query = request.args.get("query")
    job_id = request.args.get("job_id")

    if not query:
        return {"status": "error", "message": "No query"}
    if len(query) < 4:
        return {"status": "error", "message": "Query too short"}, 400

    if not job_id:
        return {"status": "error", "message": "No job_id"}, 400

    database.jobs[job_id] = job = JobHandler(job_id)

    job.get_list_of_novel(query)

    return {"status": "success"}, 200


# ----------------------------------------------- Choose Novel ----------------------------------------------- #


@app.route("/api/addnovel/choose_novel")
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


@app.route("/api/addnovel/choose_source")
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


@app.route("/api/addnovel/download")
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
            "status": "success",
            "message": job.get_status(),
            "url": "not implemented",
        }, 200

    if not job.metadata_downloaded:
        job.select_novel(novel_id)
        job.select_source(source_id)
        return {"status": "pending", "message": job.get_status()}, 200

    job.start_download()

    return {"status": "pending", "message": job.get_status()}, 200

    # Busy : Downloading metadata or downloading novel
    #    --> send status
    # Not busy :
    #    Job is finished :
    #        -> send status and url
    #    Metadata not downloaded :
    #       --> Select novel, select source (=> download metadata) --> busy
    #    Metadata downloaded :
    #       --> Start download --> busy


# ----------------------------------------------- Direct Download ----------------------------------------------- #


@app.route("/api/addnovel/direct_download")
def direct_download():
    """Directly download a novel using the novel url"""

    job_id = request.args.get("job_id")

    novel_url = request.args.get("url")
    if not novel_url:
        return {"status": "error", "message": "Missing url"}, 400
    elif not novel_url.startswith("http"):
        {"status": "error", "message": "Invalid URL"}

    if not job_id in database.jobs or (
        isinstance(database.jobs[job_id], FinishedJob)
        and database.jobs[job_id].original_query != novel_url
    ):
        # If the job is finished and the query doesn't match, overwrite the old job
        database.jobs[job_id] = job = JobHandler(job_id)
    else:
        # If they match it means it is the current job, continue with it
        job = database.jobs[job_id]

    if job.is_busy:
        return {"status": "pending", "message": job.get_status()}, 200

    if isinstance(job, FinishedJob):
        return {"status": "success", "message": job.get_status()}, 200

    if not job.metadata_downloaded:
        job.prepare_direct_download(novel_url)
        return {"status": "pending", "message": job.get_status()}, 200

    else:
        job.start_download()
        return {"status": "pending", "html": job.get_status()}, 200

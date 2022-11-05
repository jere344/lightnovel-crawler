from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "Hello World!"

path_to_cache = {
    "/image":"10d", 
    "/flags":"30d",
    }

@app.after_request
def add_header(response):
    for path, duration in path_to_cache.items():
        if request.path.removeprefix("/api").startswith(path):
            response.headers["Cache-Control"] = f"public, max-age={duration}"
            
    return response
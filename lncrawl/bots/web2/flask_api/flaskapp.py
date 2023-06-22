from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_compress import Compress
from . import lib

origins = [
    lib.WEBSITE_URL,
    lib.WEBSITE_URL.replace("http://", "https://"),
    "http://localhost:5000",
]

app = Flask(__name__)
CORS(app, origins=origins)
Compress(app)

@app.route("/")
@cross_origin()
def hello_world():
    return "Hello World!"

path_to_cache = {
    "/image": 2592000, # 30 days
    "/flags": 2592000,
    }

@app.after_request
def add_header(response):
    response.headers['Set-Cookie'] = ''
    for path, duration in path_to_cache.items():
        if request.path.removeprefix("/api").startswith(path):
            response.headers["Cache-Control"] = f"public, max-age={duration}"
            
    return response
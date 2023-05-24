from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_compress import Compress

origins = [
    "http://localhost:3000",
    "http://lncrawler.monster",
    "https://lncrawler.monster",
    "http://www.lncrawler.monster",
    "https://www.lncrawler.monster",
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
from . import flask_api

def start():
    flask_api.flaskapp.app.run()
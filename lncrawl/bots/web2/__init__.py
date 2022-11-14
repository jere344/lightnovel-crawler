from . import flask_api

def start():
    # For developpement server uncomment this line :
    flask_api.flaskapp.app.run()

    # For production server uncomment theses two lines :
    # from waitress import serve
    # serve(flask_api.flaskapp.app, host=flask_api.lib.HOST, port=flask_api.lib.PORT)

    # You can change the port and the host in the configuration file "config.json"


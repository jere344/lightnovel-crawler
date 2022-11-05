from . import flask_api

def start():
    # For developpement server uncomment this line :
    # flask_api.flaskapp.app.run()

    # For production server uncomment theses two lines :
    from waitress import serve
    serve(flask_api.flaskapp.app, host="192.168.2.18", port=5000)

    # You can change the port and the host depending on your configuration, exemple :
    # flask_api.flaskapp.app.run(host='192.168.1.1', port=5000)
    # serve(flask_api.flaskapp.app, host='192.168.1.1', port=5000)

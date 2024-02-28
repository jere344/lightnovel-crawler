from . import flask_api

# You can change the port and the host in the configuration file "config.json"


def start():
    if flask_api.lib.config["dev_mode"] == "true":
        flask_api.flaskapp.app.run(
            host=flask_api.lib.HOST, port=flask_api.lib.PORT, debug=True
        )

    elif flask_api.lib.config["dev_mode"] == "false":
        from waitress import serve

        serve(flask_api.flaskapp.app, host=flask_api.lib.HOST, port=flask_api.lib.PORT)

    else:
        raise ValueError(
            "Invalid value for dev_mode in config.json (must be true or false)"
        )

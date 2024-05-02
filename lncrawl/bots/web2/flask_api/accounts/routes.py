import logging

logger = logging.getLogger(__name__)
from flask import request
from flask_bcrypt import Bcrypt
from ..flaskapp import app
from .models import account_db, User

app.config["SECRET_KEY"] = "secret"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flaskdb.db"

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

bcrypt = Bcrypt(app)
account_db.init_app(app)

with app.app_context():
    account_db.create_all()

@app.route("/api/accounts/signup", methods=["POST"])
@app.route("/accounts/signup", methods=["POST"])
def signup():
    """
    Signup a new user
    """
    data = request.json
    pseudo = data.get("pseudo")
    email = data.get("email")
    password = data.get("password")

    user_exists = User.query.filter_by(email=request.json.get("email")).first() is not None
    if user_exists:
        return {"error": "Email already exists"}, 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, pseudo=pseudo)
    account_db.session.add(new_user)
    account_db.session.commit()

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
        }}, 201

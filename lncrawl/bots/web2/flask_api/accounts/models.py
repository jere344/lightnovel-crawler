from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

account_db = SQLAlchemy()

def get_UUID():
    return uuid4().hex
    

class User(account_db.Model):
    __tablename__ = "users"
    id = account_db.Column(account_db.String(32), primary_key=True, default=get_UUID)
    pseudo = account_db.Column(account_db.String(100), unique=True, nullable=False)
    email = account_db.Column(account_db.String(100), unique=True, nullable=False)
    password = account_db.Column(account_db.String(100), nullable=False)
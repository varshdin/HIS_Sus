import sqlalchemy as dbs
from dash import Dash
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from pages.db import DATABASE_URL

#DATABASE_URL='postgresql://postgres:password@localhost:5432/dashboard'
engine = dbs.create_engine(DATABASE_URL)



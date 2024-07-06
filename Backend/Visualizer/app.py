from dash import Dash, html, dcc
import dash
from flask import Flask,jsonify
import os
from flask_sqlalchemy import SQLAlchemy
from pages.model.bigram import Bigram,db as b
from pages.model.final_indicator import FinalIndicator,db as f
from pages.model.group_2_data import Indicator,db as i
from pages.db import DATABASE_URL,db


external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
server = Flask(__name__)
server.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

db.init_app(server)
with server.app_context(): 
 db.create_all()

app = Dash(__name__, use_pages=True, external_stylesheets=external_stylesheets)


# app.layout = html.Div([
# 	# html.H1('Multi-page app with Dash Pages'),

#     html.Div(
#         [
#             html.Div(
#                 dcc.Link(
#                     f"{page['name']} - {page['path']}", href=page["relative_path"]
#                 )
#             )
#             for page in dash.page_registry.values()
#         ]
#     ),

# 	dash.page_container
# ])

server = app.server
if __name__ == '__main__':
	server = app.run_server(debug=True)
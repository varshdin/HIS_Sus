from flask_sqlalchemy import SQLAlchemy

#DATABASE_URL='postgresql://postgres:password@localhost:5432/dbt'
DATABASE_URL='postgresql://fuas:fuas2022!@sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com:5432/indicators'
DATABASE_URL_TEXTUAL_DASHBOARD='postgresql://fuas:fuas2022!@sustainability.cvnuvcym0gmh.eu-central-1.rds.amazonaws.com:5432/textual'

db = SQLAlchemy()
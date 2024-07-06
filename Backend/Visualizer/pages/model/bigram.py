
#from pages.config import db
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,Integer,String,Numeric
from pages.db import db



#Base= declarative_base()

class Bigram(db.Model):
   __tablename__='bigram'

   id = Column(Integer, primary_key=True)
   company_name = Column(String(120),  nullable=False)
   year = Column(Integer,  nullable=False)
   variable = Column(String(120),  nullable=False)
   word_freq = Column(Integer,  nullable=False)
   
   def __init__(self, title, content):
     self.title = title
     self.content = content
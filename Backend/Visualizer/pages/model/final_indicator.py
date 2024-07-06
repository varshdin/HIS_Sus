
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,Integer,String,Numeric
from flask_sqlalchemy import SQLAlchemy
from pages.db import db


#Base= declarative_base()
#db = SQLAlchemy()


class FinalIndicator(db.Model):
  __tablename__='final_indicator'  
  id = Column(Integer, primary_key=True)
  name = Column(String(120),  nullable=False)
  year = Column(Integer,  nullable=False)
  scope1_intensity = Column(Numeric,  nullable=True)
  scope2_intensity = Column(Numeric,  nullable=True)
  scope3_intensity = Column(Numeric,  nullable=True)
  scope_1 = Column(Numeric,  nullable=True)
  scope_2 = Column(Numeric,  nullable=True)
  scope_3 = Column(Numeric,  nullable=True)
  energy_cons = Column(Numeric,  nullable=True)
  waste = Column(Numeric,  nullable=True)
  waste_recycled = Column(Numeric,  nullable=True)
  water_cons = Column(Numeric,  nullable=True)
  waste_water = Column(Numeric,  nullable=True)
  renewable_energy_pct = Column(Numeric,  nullable=True)
  waste_recycled_pct = Column(Numeric,  nullable=True)
  fuel_fleet = Column(Numeric,  nullable=True)
  donations = Column(Numeric,  nullable=True)
  donations_pct = Column(Numeric,  nullable=True)
  contrib_political = Column(Numeric,  nullable=True)
  legal_spending = Column(Numeric,  nullable=True)
  fines_spending = Column(Numeric,  nullable=True)
  employees = Column(Numeric,  nullable=True)
  employee_turnover = Column(Numeric,  nullable=True)
  female_pct = Column(Numeric,  nullable=True)
  female_mgmt_pct = Column(Numeric,  nullable=True)
  employee_parental_pct = Column(Numeric,  nullable=True)
  employee_tenure = Column(Numeric,  nullable=True)
  employee_under30_pct = Column(Numeric,  nullable=True)
  employee_over50_pct = Column(Numeric,  nullable=True)
  training_spending = Column(Numeric,  nullable=True)

  def __init__(self, title, content):
    self.title = title
    self.content = content

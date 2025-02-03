from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from db_schema import Base, create_combined_db, User, ExamResult  
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)


def create_combined_db_flask():

    base_dir = os.path.abspath(os.path.dirname(__file__))
    instance_dir = os.path.join(base_dir, 'instance')

    
    if not os.path.exists(instance_dir):
        os.makedirs(instance_dir)

   
    db_url = f"sqlite:///{os.path.join(instance_dir, 'database.db')}"
    
  
    create_combined_db(db_url)  

   
    with app.app_context():
        db.create_all() 
        print("Combined database and tables created successfully!")

if __name__ == '__main__':
   
    create_combined_db_flask()

from sqlalchemy import Column, Integer, Text, Enum, Boolean, ForeignKey, DateTime, Float, String, func, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    age = Column(Integer, nullable=False)
    password_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=func.current_timestamp())

    def set_password(self, password):
        """Hashes the password and sets the password_hash field."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks the hashed password against the provided password."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"


class ExamResult(Base):
    __tablename__ = 'exam_results'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    score = Column(Float, nullable=False)
    submitted_at = Column(DateTime, default=func.current_timestamp())

  
    user = relationship('User', backref='results')

    def __repr__(self):
        return f"<ExamResult User {self.user_id}, Score {self.score}>"


class Question(Base):
    __tablename__ = 'questions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(
        Enum('multiple_choice', 'single_choice', 'true_false', 'subjective', 'integer_type', name='question_type')
,
        nullable=False
    )
    marks = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=func.current_timestamp())
    updated_at = Column(DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())

    # Relationship to options
    options = relationship('Option', back_populates='question', cascade='all, delete-orphan')


class Option(Base):
    __tablename__ = 'options'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey('questions.id', ondelete='CASCADE'), nullable=False)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, nullable=False, default=False)


    question = relationship('Question', back_populates='options')

class CorrectAnswer(Base):
    __tablename__ = 'correct_answers'

    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey('questions.id', ondelete='CASCADE'), nullable=False)
    
    # Use this for multiple-choice and single-choice questions
    option_id = Column(Integer, ForeignKey('options.id', ondelete='CASCADE'), nullable=True)

    # Use this for integer-type questions
    integer_answer = Column(Integer, nullable=True)

    # Ensure either option_id or integer_answer is provided
    __table_args__ = (CheckConstraint('(option_id IS NOT NULL) OR (integer_answer IS NOT NULL)', name='correct_answer_constraint'),)


def create_combined_db(db_url='sqlite:///instance/database.db'):
    from sqlalchemy import create_engine
    engine = create_engine(db_url, echo=True)
    Base.metadata.create_all(engine)
    print("Combined database and tables created successfully!")
    return engine

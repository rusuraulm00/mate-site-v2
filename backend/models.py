from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()
def init_db(app):
    db.init_app(app)

# Define Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.now)
    problems_solved = db.relationship('UserProblem', backref='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }

class Lesson(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('math_topic.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f'<Lesson {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'topic_id': self.topic_id,
            'created_at': self.created_at.isoformat()
        }
class MathTopic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.Text)
    problems = db.relationship('MathProblem', backref='topic', lazy='dynamic')
    lessons = db.relationship('Lesson', backref='topic',lazy='dynamic')

    def __repr__(self):
        return f'<Topic {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'lessons':[lesson.to_dict() for lesson in self.lessons]
        }

class MathProblem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Integer, default=1)  # 1-5 scale
    topic_id = db.Column(db.Integer, db.ForeignKey('math_topic.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)
    choices = db.relationship(
        'ProblemChoice',
        backref='problem',
        lazy='dynamic',
        foreign_keys='ProblemChoice.problem_id'  
    )
    correct_choice_id = db.Column(
        db.Integer,
        db.ForeignKey('problem_choice.id', use_alter=True),  
        nullable=True
    )

    def __repr__(self):
        return f'<Problem {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'difficulty': self.difficulty,
            'topic_id': self.topic_id,
            'created_at': self.created_at.isoformat(),
            'choices': [choice.to_dict() for choice in self.choices],
            'correct_choice_id': self.correct_choice_id
        }
    
class ProblemChoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(255), nullable=False)
    problem_id = db.Column(
        db.Integer,
        db.ForeignKey('math_problem.id', use_alter=True)  
    )

    def __repr__(self):
        return f'<Choice {self.text}>'

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'problem_id': self.problem_id
        }

class UserProblem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    problem_id = db.Column(db.Integer, db.ForeignKey('math_problem.id'))
    solved_at = db.Column(db.DateTime, default=datetime.now)
    user_solution = db.Column(db.Text)
    is_correct = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<UserProblem {self.user_id}:{self.problem_id}>'
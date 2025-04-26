from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from datetime import datetime
from auth import auth as auth_blueprint
from problems import problems as problems_blueprint

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
app.register_blueprint(problems_blueprint, url_prefix='/api/problems')

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'math_website.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy and Migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)

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

class MathTopic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    description = db.Column(db.Text)
    problems = db.relationship('MathProblem', backref='topic', lazy='dynamic')

    def __repr__(self):
        return f'<Topic {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class MathProblem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    solution = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.Integer, default=1)  # 1-5 scale
    topic_id = db.Column(db.Integer, db.ForeignKey('math_topic.id'))
    created_at = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f'<Problem {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'difficulty': self.difficulty,
            'topic_id': self.topic_id,
            'created_at': self.created_at.isoformat()
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

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify(message="Hello from the math API!")

@app.route('/api/calculate/<operation>', methods=['POST'])
def calculate(operation):
    data = request.get_json()
    num1 = data.get('num1', 0)
    num2 = data.get('num2', 0)
    
    result = None
    if operation == 'add':
        result = num1 + num2
    elif operation == 'subtract':
        result = num1 - num2
    elif operation == 'multiply':
        result = num1 * num2
    elif operation == 'divide':
        if num2 == 0:
            return jsonify({"error": "Cannot divide by zero"}), 400
        result = num1 / num2
    else:
        return jsonify({"error": "Invalid operation"}), 400
    
    return jsonify({"result": result})


# New database-related API routes
@app.route('/api/topics', methods=['GET'])
def get_topics():
    topics = MathTopic.query.all()
    return jsonify([topic.to_dict() for topic in topics])

@app.route('/api/topics', methods=['POST'])
def create_topic():
    data = request.get_json()

    if not data or not data.get('name'):
        return jsonify({"error": "Name is required"}), 400

    topic = MathTopic(
        name=data.get('name'),
        description=data.get('description', '')
    )

    db.session.add(topic)
    db.session.commit()

    return jsonify(topic.to_dict()), 201

@app.route('/api/problems', methods=['GET'])
def get_problems():
    topic_id = request.args.get('topic_id')

    if topic_id:
        problems = MathProblem.query.filter_by(topic_id=topic_id).all()
    else:
        problems = MathProblem.query.all()

    return jsonify([problem.to_dict() for problem in problems])

@app.route('/api/problems/<int:problem_id>', methods=['GET'])
def get_problem(problem_id):
    problem = MathProblem.query.get_or_404(problem_id)
    return jsonify(problem.to_dict())

@app.route('/api/problems', methods=['POST'])
def create_problem():
    data = request.get_json()

    if not data or not data.get('title') or not data.get('content') or not data.get('solution'):
        return jsonify({"error": "Title, content, and solution are required"}), 400

    problem = MathProblem(
        title=data.get('title'),
        content=data.get('content'),
        solution=data.get('solution'),
        difficulty=data.get('difficulty', 1),
        topic_id=data.get('topic_id')
    )

    db.session.add(problem)
    db.session.commit()

    return jsonify(problem.to_dict()), 201

# Initialize database
with app.app_context():
    db.create_all()

    if MathTopic.query.count() == 0:
        topics = [
            MathTopic(name="Algebra", description="Study of mathematical symbols and rules"),
            MathTopic(name="Calculus", description="Study of continuous change"),
            MathTopic(name="Geometry", description="Study of shapes and properties of space"),
            MathTopic(name="Statistics", description="Study of data collection and analysis")
        ]
        db.session.add_all(topics)
        db.session.commit()

__all__ = ['app', 'db', 'User', 'MathTopic', 'MathProblem']

if __name__ == '__main__':
    app.run(debug=True)
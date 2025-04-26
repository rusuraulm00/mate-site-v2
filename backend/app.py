from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
import os
from auth import auth as auth_blueprint
from problems import problems as problems_blueprint
from models import db, User, MathTopic, MathProblem, init_db

app = Flask(__name__)
CORS(app)
app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
app.register_blueprint(problems_blueprint, url_prefix='/api/problems')

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'math_website.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

init_db(app)

# Initialize SQLAlchemy and Migrate
migrate = Migrate(app, db)

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
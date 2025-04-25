from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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

@app.route('/api/topics', methods=['GET'])
def get_topics():
    topics = [
        {"id": 1, "name": "Algebra", "description": "Study of mathematical symbols and rules"},
        {"id": 2, "name": "Calculus", "description": "Study of continuous change"},
        {"id": 3, "name": "Geometry", "description": "Study of shapes and properties of space"},
        {"id": 4, "name": "Statistics", "description": "Study of data collection and analysis"}
    ]
    return jsonify(topics)

if __name__ == '__main__':
    app.run(debug=True)
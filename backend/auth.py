from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from aplicatie import db, User
import jwt
import datetime
import os

# Create a Blueprint for authentication routes
auth = Blueprint('auth', __name__)

# Secret key for JWT
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')


def generate_token(user_id):
    """Generate a JWT token for a user"""
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')


def token_required(f):
    """Decorator for routes that require authentication"""

    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            # Decode token
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['sub'])
            if not current_user:
                return jsonify({'message': 'Invalid token!'}), 401
        except:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Check if required fields are present
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields!'}), 400

    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists!'}), 409

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists!'}), 409

    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )

    # Add user to database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully!'}), 201


@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Check if required fields are present
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing required fields!'}), 400

    # Find user by username
    user = User.query.filter_by(username=data['username']).first()

    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials!'}), 401

    # Generate token
    token = generate_token(user.id)

    return jsonify({
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    })


@auth.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    """Get current user profile"""
    return jsonify(current_user.to_dict())
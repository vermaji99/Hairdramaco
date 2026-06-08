from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from models.models import db, User
from google.oauth2 import id_token
from google.auth.transport import requests
from config.config import Config
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing fields'}), 400

    if not email.endswith('@gmail.com'):
        return jsonify({'error': 'Only Gmail accounts are allowed'}), 403

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        avatar_url=f"https://ui-avatars.com/api/?name={name}&background=random"
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/google', methods=['POST'])
def google_auth():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({'error': 'No token provided'}), 400

    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), Config.GOOGLE_CLIENT_ID)

        # Check if email is Gmail
        email = idinfo.get('email')
        if not email.endswith('@gmail.com'):
            return jsonify({'error': 'Only Gmail accounts are allowed'}), 403

        # Check if user exists, else create
        user = User.query.filter_by(google_id=idinfo['sub']).first()
        if not user:
            user = User(
                google_id=idinfo['sub'],
                name=idinfo.get('name'),
                email=email,
                avatar_url=idinfo.get('picture')
            )
            db.session.add(user)
            db.session.commit()

        # Create JWT token
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            'token': access_token,
            'user': user.to_dict()
        }), 200

    except ValueError:
        return jsonify({'error': 'Invalid token'}), 400

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

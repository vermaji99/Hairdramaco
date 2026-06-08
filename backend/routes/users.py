from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.models import User

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    search = request.args.get('search', '')
    if search:
        users = User.query.filter(User.email.ilike(f'%{search}%')).all()
    else:
        users = User.query.all()
    
    return jsonify([user.to_dict() for user in users]), 200

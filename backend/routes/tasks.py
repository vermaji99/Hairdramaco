from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Task, User
from services.email_service import EmailService

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = int(get_jwt_identity())
    
    # Filter options
    filter_type = request.args.get('filter', 'all')
    
    if filter_type == 'created_by_me':
        tasks = Task.query.filter_by(created_by=user_id).all()
    elif filter_type == 'assigned_to_me':
        tasks = Task.query.filter_by(assigned_to=user_id).all()
    else:
        # Get all tasks in the system
        tasks = Task.query.all()
        
    return jsonify([task.to_dict() for task in tasks]), 200

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify(task.to_dict()), 200

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    new_task = Task(
        title=data['title'],
        description=data.get('description'),
        created_by=user_id,
        assigned_to=data.get('assigned_to'),
        status='pending'
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    # Notify assignee if assigned to someone else
    if new_task.assigned_to and new_task.assigned_to != user_id:
        assignee = User.query.get(new_task.assigned_to)
        creator = User.query.get(user_id)
        if assignee:
            EmailService.notify_task_creation(assignee.email, new_task.title, creator.name)
            
    return jsonify(new_task.to_dict()), 201

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()
    
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.assigned_to = data.get('assigned_to', task.assigned_to)
    
    db.session.commit()
    return jsonify(task.to_dict()), 200

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200

@tasks_bp.route('/<int:task_id>/complete', methods=['PATCH'])
@jwt_required()
def complete_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.status = 'completed'
    db.session.commit()
    
    # Notify creator if completed by assignee
    user_id = int(get_jwt_identity())
    if task.created_by != user_id:
        creator = User.query.get(task.created_by)
        assignee = User.query.get(user_id)
        if creator:
            EmailService.notify_task_completion(creator.email, task.title, assignee.name)
            
    return jsonify(task.to_dict()), 200

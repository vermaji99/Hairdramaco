from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(100), unique=True, nullable=True) # Now optional
    password_hash = db.Column(db.String(255), nullable=True) # For email login
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    avatar_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    tasks_created = db.relationship('Task', foreign_keys='Task.created_by', backref='creator', lazy=True)
    tasks_assigned = db.relationship('Task', foreign_keys='Task.assigned_to', backref='assignee', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'google_id': self.google_id,
            'name': self.name,
            'email': self.email,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat()
        }

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, completed
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'created_by': self.created_by,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'creator': self.creator.to_dict() if self.creator else None,
            'assignee': self.assignee.to_dict() if self.assignee else None
        }

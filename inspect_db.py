from app import create_app
from models.models import db, Task, User

app = create_app()

with app.app_context():
    users = User.query.all()
    print(f"Total Users: {len(users)}")
    for u in users:
        print(f"  ID: {u.id}, Name: {u.name}, Email: {u.email}")
    
    tasks = Task.query.all()
    print(f"\nTotal Tasks in DB: {len(tasks)}")
    for t in tasks:
        print(f"  ID: {t.id}, Title: {t.title}, Created By: {t.created_by}, Assigned To: {t.assigned_to}")

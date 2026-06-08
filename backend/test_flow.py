import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models.models import db, User, Task
from services.email_service import EmailService

def test_full_flow():
    app = create_app()
    with app.app_context():
        print("\n--- Testing Database and Logic Flow ---")
        
        # 1. Create Mock Users
        u1 = User.query.filter_by(email="creator@gmail.com").first()
        if not u1:
            u1 = User(google_id="mock_1", name="Creator User", email="creator@gmail.com", avatar_url="")
            db.session.add(u1)
        
        u2 = User.query.filter_by(email="assignee@gmail.com").first()
        if not u2:
            u2 = User(google_id="mock_2", name="Assignee User", email="assignee@gmail.com", avatar_url="")
            db.session.add(u2)
        
        db.session.commit()
        print(f"Users ready: {u1.name} and {u2.name}")

        # 2. Test Task Creation and Notification
        print("\nTesting Task Creation...")
        new_task = Task(
            title="Test Task via Script",
            description="Testing email notification",
            created_by=u1.id,
            assigned_to=u2.id,
            status='pending'
        )
        db.session.add(new_task)
        db.session.commit()
        print(f"Task created: {new_task.title}")

        # Simulate the logic in routes/tasks.py
        if new_task.assigned_to and new_task.assigned_to != u1.id:
            print(f"Triggering email to assignee: {u2.email}")
            EmailService.notify_task_creation(u2.email, new_task.title, u1.name)

        # 3. Test Task Completion and Notification
        print("\nTesting Task Completion...")
        new_task.status = 'completed'
        db.session.commit()
        print(f"Task marked as completed")

        # Simulate logic in routes/tasks.py
        if new_task.created_by != u2.id: # Completed by assignee
            print(f"Triggering email to creator: {u1.email}")
            EmailService.notify_task_completion(u1.email, new_task.title, u2.name)

        print("\n--- Test Flow Completed Successfully ---")

if __name__ == "__main__":
    test_full_flow()

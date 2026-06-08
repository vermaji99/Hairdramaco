import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.email_service import EmailService
from config.config import Config
from dotenv import load_dotenv

load_dotenv()

def test_smtp():
    print("--- SMTP Configuration Test ---")
    print(f"GMAIL_EMAIL: {Config.GMAIL_EMAIL}")
    print(f"GMAIL_APP_PASSWORD: {'*' * len(Config.GMAIL_APP_PASSWORD) if Config.GMAIL_APP_PASSWORD else 'Not Set'}")
    
    if not Config.GMAIL_EMAIL or not Config.GMAIL_APP_PASSWORD:
        print("ERROR: SMTP credentials not set in .env")
        return

    test_receiver = Config.GMAIL_EMAIL # Sending a test email to yourself
    subject = "TaskManager - SMTP Test Email"
    body = "<h1>Test Successful!</h1><p>This is a test email from your TaskManager application.</p>"
    
    print(f"Attempting to send test email to {test_receiver}...")
    EmailService.send_email(test_receiver, subject, body)
    print("Check your inbox (and spam folder) for the test email.")

if __name__ == "__main__":
    test_smtp()

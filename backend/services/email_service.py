import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.config import Config

class EmailService:
    @staticmethod
    def get_html_template(title, message, button_text=None, button_url=None, color="#2563eb"):
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                .container {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }}
                .header {{ text-align: center; padding: 20px 0; border-bottom: 2px solid #f3f4f6; }}
                .content {{ padding: 30px 0; line-height: 1.6; }}
                .button {{ display: inline-block; padding: 12px 24px; background-color: {color}; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }}
                .footer {{ text-align: center; font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 20px; }}
                .badge {{ display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; background-color: {color}20; color: {color}; margin-bottom: 10px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="color: {color}; margin: 0;">TaskManager Pro</h1>
                </div>
                <div class="content">
                    <div class="badge">{title}</div>
                    <p>{message}</p>
                    {f'<a href="{button_url}" class="button">{button_text}</a>' if button_text else ''}
                </div>
                <div class="footer">
                    <p>This is an automated notification from your TaskManager Pro workspace.</p>
                    <p>&copy; 2024 TaskManager Pro. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """

    @staticmethod
    def send_email(to_email, subject, body_html):
        print(f"DEBUG: Attempting to send email to {to_email}")
        if not Config.GMAIL_EMAIL or not Config.GMAIL_APP_PASSWORD:
            print("DEBUG: Email configuration missing.")
            return

        try:
            msg = MIMEMultipart()
            msg['From'] = f"TaskManager Pro <{Config.GMAIL_EMAIL}>"
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body_html, 'html'))

            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(Config.GMAIL_EMAIL, Config.GMAIL_APP_PASSWORD)
            server.sendmail(Config.GMAIL_EMAIL, to_email, msg.as_string())
            server.quit()
            print(f"DEBUG: Email successfully sent to {to_email}")
        except Exception as e:
            print(f"DEBUG ERROR: {str(e)}")

    @staticmethod
    def notify_task_creation(assignee_email, task_title, creator_name):
        subject = f"🚀 New Task: {task_title}"
        message = f"Hello! <b>{creator_name}</b> has assigned a new task to you: <b>\"{task_title}\"</b>. Click the button below to view it in your dashboard."
        html = EmailService.get_html_template("New Assignment", message, "View Dashboard", "http://localhost:3000/dashboard", "#2563eb")
        EmailService.send_email(assignee_email, subject, html)

    @staticmethod
    def notify_task_completion(creator_email, task_title, assignee_name):
        subject = f"✅ Task Completed: {task_title}"
        message = f"Great news! <b>{assignee_name}</b> has completed the task: <b>\"{task_title}\"</b>."
        html = EmailService.get_html_template("Task Completed", message, "Open Dashboard", "http://localhost:3000/dashboard", "#16a34a")
        EmailService.send_email(creator_email, subject, html)

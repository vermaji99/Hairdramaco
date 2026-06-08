from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models.models import db
from config.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    JWTManager(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.users import users_bp
    from routes.tasks import tasks_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(tasks_bp, url_prefix='/tasks')

    with app.app_context():
        db.create_all()

    return app

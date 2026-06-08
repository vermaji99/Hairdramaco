import logging
from flask import Flask, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models.models import db
from config.config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    JWTManager(app)

    # Add COOP header for Google Auth
    @app.after_request
    def add_headers(response):
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin-allow-popups'
        return response

    # Global error handler for logging
    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
        response = jsonify({"error": "Internal Server Error", "message": str(e)})
        response.status_code = 500
        return response

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

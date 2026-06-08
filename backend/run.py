from app import create_app
import os
import sys

# Add the current directory to sys.path to allow imports from app, routes, etc.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

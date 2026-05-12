from flask import Flask, request, jsonify
from flask_cors import CORS  # <--- Install this: pip install flask-cors

app = Flask(__name__)
CORS(app) # This allows ALL origins. For production, you'd limit this.

@app.route('/api/chat', methods=['POST']) # Note: 'methods' is plural
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Simple AI response logic
        return jsonify({"response": f"AI Assistant: I received '{user_message}'"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

ANSWERS_PATH = os.path.join(os.path.dirname(__file__), 'answers.json')


@app.route('/answers', methods=['POST'])
def save_answers():
    try:
        data = request.get_json()
        if data is None:
            return jsonify({'error': 'Invalid JSON'}), 400

        # Persist to answers.json (overwrite or create)
        with open(ANSWERS_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        return jsonify({'status': 'ok', 'path': ANSWERS_PATH}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Run on port 5000 by default
    app.run(host='0.0.0.0', port=5000, debug=True)

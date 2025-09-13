from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model
model = pickle.load(open("diabetes_model.pkl", "rb"))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        # Example: expect an array of features
        features = np.array(data['features']).reshape(1, -1)
        prediction = model.predict(features)[0]
        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == "__main__":
    app.run(debug=True)

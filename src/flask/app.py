from flask import Flask, request, jsonify
import numpy as np
import librosa
import tensorflow as tf
import os
from sklearn.preprocessing import LabelEncoder

# Initialize the Flask app
app = Flask(__name__)

# Load the trained model
MODEL_PATH = 'my_model.keras'  # Ensure this is the correct path to your model
model = tf.keras.models.load_model(MODEL_PATH)

# Define the class labels
class_labels = [
    'dog_bark', 'children_playing', 'car_horn', 'air_conditioner', 'street_music',
    'gun_shot', 'siren', 'engine_idling', 'jackhammer', 'drilling'
]
le = LabelEncoder()
le.fit(class_labels)

# Function to preprocess audio
def preprocess_audio(file_path):
    try:
        audio, sample_rate = librosa.load(file_path, sr=None)
        n_fft = min(2048, len(audio))  # Adjust FFT window size
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40, n_fft=n_fft)
        mfccs_scaled = np.mean(mfccs.T, axis=0)
        mfccs_scaled = mfccs_scaled[np.newaxis, ..., np.newaxis]  # Reshape for model input
        return mfccs_scaled
    except Exception as e:
        print(f"Error processing audio: {e}")
        return None

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the uploaded file temporarily
        temp_path = os.path.join('uploads', file.filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(temp_path)

        # Preprocess the audio
        features = preprocess_audio(temp_path)
        if features is None:
            return jsonify({'error': 'Error processing audio file'}), 400

        # Predict the class
        predictions = model.predict(features)
        predicted_class = np.argmax(predictions, axis=1)
        class_label = le.inverse_transform(predicted_class)

        # Clean up temporary file
        os.remove(temp_path)

        # Return the result
        return jsonify({'prediction': class_label[0]}), 200

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'An error occurred during prediction'}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import os
import librosa
import tensorflow as tf
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import LabelEncoder

from sklearn.model_selection import train_test_split
from statsmodels.tsa.arima.model import ARIMA
from pmdarima import auto_arima
import warnings
from flask_cors import CORS

warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# ----------------- Random Forest & ARIMA Section -----------------

# Load datasets
csv_file_path = "noise_data.csv"
data = pd.read_csv(csv_file_path).dropna()
data.rename(columns={'Day': 'avg_day_value', 'Night': 'avg_night_value'}, inplace=True)
df = pd.read_csv(csv_file_path).dropna()

# One-hot encode 'Station'
encoder = OneHotEncoder(sparse_output=False, drop='first')
station_encoded = encoder.fit_transform(df[['Station']])
X = pd.concat([pd.DataFrame(station_encoded), df[['Year', 'Month']].reset_index(drop=True)], axis=1)
y = df[['Day', 'Night']]
X.columns = X.columns.astype(str)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

y_pred_test = rf_model.predict(X_test)
r2_day_model = r2_score(y_test['Day'], y_pred_test[:, 0])
r2_night_model = r2_score(y_test['Night'], y_pred_test[:, 1])

@app.route('/predict_random_forest', methods=['POST'])
def predict_random_forest():
    data = request.json
    station = data['station']
    month = int(data['month'])
    year = int(data['year'])
    station_encoded = encoder.transform([[station]])
    input_data = pd.concat([pd.DataFrame(station_encoded), pd.DataFrame([[year, month]])], axis=1)
    noise_pred = rf_model.predict(input_data)
    return jsonify({
        'predicted_day_value': noise_pred[0, 0],
        'predicted_night_value': noise_pred[0, 1],
        'r2_day': r2_day_model,
        'r2_night': r2_night_model
    })

@app.route('/predict_arima', methods=['POST'])
def predict_arima():
    user_date = request.json.get('date')
    user_station = request.json.get('station')
    filtered_data = data[data['Station'] == user_station]
    if filtered_data.empty:
        return jsonify({"error": "Station not found."}), 400

    size = int(len(filtered_data) * 0.80)
    X = filtered_data['avg_day_value']
    Y = filtered_data['avg_night_value']
    
    # Day prediction with ARIMA
    train, test = X[:size], X[size:]
    history = [x for x in train]
    observations = list(test)
    predictions = []

    # Use auto_arima to select best parameters
    auto_model = auto_arima(filtered_data["avg_day_value"])
    p, d, q = auto_model.order
    for obs in observations:
        history.append(obs)
        model = ARIMA(history, order=(p, d, q)).fit()
        yhat = model.forecast()[0]
        predictions.append(yhat)
    r2_day = r2_score(observations, predictions)

    # Night prediction with ARIMA
    train2, test2 = Y[:size], Y[size:]
    history2 = list(train2)
    observations2 = list(test2)
    predictions2 = []

    auto_model2 = auto_arima(filtered_data["avg_night_value"])
    a, b, c = auto_model2.order
    for obs2 in observations2:
        history2.append(obs2)
        model2 = ARIMA(history2, order=(a, b, c)).fit()
        yhat2 = model2.forecast()[0]
        predictions2.append(yhat2)
    r2_night = r2_score(observations2, predictions2)

    # Prepare a date range and results for the given date
    index_months = pd.date_range(start='2011-01-01', end='2019-04-01', freq="MS")
    pred2 = model2.predict(start=1, end=len(filtered_data) + 4)
    pred = model.predict(start=1, end=len(filtered_data) + 4)

    dataframe = pd.DataFrame({"Date": index_months, "DayPredictions": pred, "NightPredictions": pred2})
    prediction_result = dataframe[dataframe['Date'] == user_date]

    if not prediction_result.empty:
        result = {
            "Station": user_station,
            "Date": user_date,
            "Prediction": prediction_result['DayPredictions'].values[0],
            "Prediction2": prediction_result['NightPredictions'].values[0],
            "r2_day": r2_day,
            "r2_night": r2_night
        }
    else:
        result = {
            "Error": "Date not found"
        }

    return jsonify(result)

# ----------------- Audio Classification Section -----------------

MODEL_PATH = "my_model.keras"
model = tf.keras.models.load_model(MODEL_PATH)
class_labels = ['dog_bark', 'children_playing', 'car_horn', 'air_conditioner', 'street_music', 'gun_shot', 'siren', 'engine_idling', 'jackhammer', 'drilling']
le = LabelEncoder().fit(class_labels)

def preprocess_audio(file_path):
    try:
        audio, sample_rate = librosa.load(file_path, sr=None)
        n_fft = min(2048, len(audio))
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40, n_fft=n_fft)
        return np.mean(mfccs.T, axis=0)[np.newaxis, ..., np.newaxis]
    except Exception as e:
        print(f"Error processing audio: {e}")
        return None

@app.route('/predict_audio', methods=['POST'])
def predict_audio():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    temp_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(temp_path)
    features = preprocess_audio(temp_path)
    os.remove(temp_path)

    if features is None:
        return jsonify({'error': 'Error processing audio file'}), 400
    predictions = model.predict(features)
    predicted_class = le.inverse_transform([np.argmax(predictions)])
    return jsonify({'prediction': predicted_class[0]}), 200

# ----------------- Main Section -----------------

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

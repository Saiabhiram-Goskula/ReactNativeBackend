//PRIMARY CODE OF ARIMA UI
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ARIMAScreen = () => {
  const [station, setStation] = useState('');
  const [date, setDate] = useState('');
  const [prediction, setPrediction] = useState<any>(null);
  const [modelUsed, setModelUsed] = useState('');

  const handlePredict = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/predict_arima', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station, date })
      });
      const data = await response.json();
      setPrediction(data);
      setModelUsed('ARIMA');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ARIMA Model Prediction</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Station Name" 
        value={station} 
        onChangeText={setStation} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Date (YYYY-MM-DD)" 
        value={date} 
        onChangeText={setDate} 
      />
      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>
      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{modelUsed} Model Prediction:</Text>
          {prediction.Error ? (
            <Text style={styles.errorText}>{prediction.Error}</Text>
          ) : (
            <>
              <Text>Day Prediction: {prediction.Prediction}</Text>
              <Text>Night Prediction: {prediction.Prediction2}</Text>
              <Text>R² Day Score: {prediction.r2_day}</Text>
              <Text>R² Night Score: {prediction.r2_night}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#FF5733' },
  input: { backgroundColor: '#fff', borderRadius: 5, padding: 10, marginBottom: 15, borderColor: '#FF5733', borderWidth: 1 },
  button: { backgroundColor: '#FF5733', padding: 12, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  resultContainer: { marginTop: 20, padding: 15, backgroundColor: '#e6ccff', borderRadius: 5 },
  resultText: { fontSize: 18, fontWeight: 'bold', color: '#5a009d' },
  errorText: { fontSize: 16, color: 'red' },
});

export default ARIMAScreen;
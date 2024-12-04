// PRIMARY CODE OF RandomForestScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const RandomForestScreen = () => {
  const [station, setStation] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [prediction, setPrediction] = useState<any>(null);
  const [modelUsed, setModelUsed] = useState('');

  const handlePredict = async () => {
    try {
      const response = await fetch('http:10.0.2.2:5000/predict_random_forest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ station, year, month })
      });
      const data = await response.json();
      setPrediction(data);
      setModelUsed('Random Forest Regression');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Random Forest Prediction</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Station Name" 
        value={station} 
        onChangeText={setStation} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Year" 
        keyboardType="numeric"
        value={year} 
        onChangeText={setYear} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Month" 
        keyboardType="numeric"
        value={month} 
        onChangeText={setMonth} 
      />
      <TouchableOpacity style={styles.button} onPress={handlePredict}>
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>
      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{modelUsed} Model Prediction:</Text>
          <Text>Day Value: {prediction.predicted_day_value}</Text>
          <Text>Night Value: {prediction.predicted_night_value}</Text>
          <Text>R² Day Score: {prediction.r2_day}</Text>
          <Text>R² Night Score: {prediction.r2_night}</Text> 
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
  resultContainer: { marginTop: 20, padding: 15, backgroundColor: '#cce5ff', borderRadius: 5 },
  resultText: { fontSize: 18, fontWeight: 'bold', color: '#005073' },
});

export default RandomForestScreen;



// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// const RandomForestScreen = () => {
//   const [station, setStation] = useState('');
//   const [year, setYear] = useState('');
//   const [month, setMonth] = useState('');
//   const [prediction, setPrediction] = useState(null);
//   const [modelUsed, setModelUsed] = useState('');

//   const handlePredict = async () => {
//     try {
//       const response = await fetch('http://10.0.2.2:5000/predict_random_forest', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ station, year, month }),
//       });
//       const data = await response.json();
//       setPrediction(data);
//       setModelUsed('Random Forest Regression');
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Random Forest Prediction</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Station Name"
//         value={station}
//         onChangeText={setStation}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Year"
//         keyboardType="numeric"
//         value={year}
//         onChangeText={setYear}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Month"
//         keyboardType="numeric"
//         value={month}
//         onChangeText={setMonth}
//       />
//       <TouchableOpacity style={styles.button} onPress={handlePredict}>
//         <Text style={styles.buttonText}>Predict</Text>
//       </TouchableOpacity>
//       {prediction && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultText}>{modelUsed} Model Prediction:</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#FF5733',
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderRadius: 25,
//     height: 50,
//     width: '80%',
//     borderColor: '#FF5733',
//     marginBottom: 20,
//     paddingLeft: 20,
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: '#FF5733',
//     padding: 15,
//     borderRadius: 25,
//     width: '80%',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default RandomForestScreen;

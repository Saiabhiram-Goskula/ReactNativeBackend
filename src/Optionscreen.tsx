// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const OptionScreen = ({ navigation }) => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Noise Prediction App</Text>
//       <Text style={styles.subtitle}>Choose Your Task</Text>

//       <TouchableOpacity 
//         style={styles.button}
//         onPress={() => navigation.navigate('MainScreen')}
//       >
//         <Text style={styles.buttonText}>Noise Prediction</Text>
//       </TouchableOpacity>
      
//       <TouchableOpacity 
//         style={styles.button}
//         onPress={() => navigation.navigate('sound')}
//       >
//         <Text style={styles.buttonText}>Sound Prediction</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
//   subtitle: { fontSize: 18, color: '#666', marginBottom: 40 },
//   button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, marginBottom: 20, width: '80%', alignItems: 'center' },
//   buttonText: { fontSize: 16, color: '#fff', fontWeight: '600' }
// });

// export default OptionScreen;


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OptionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noise AI</Text>
      <Text style={styles.subtitle}>Choose Your Task</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MainScreen')}>
        <Text style={styles.buttonText}>Noise Prediction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Sound')}>
        <Text style={styles.buttonText}>Sound Prediction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#FF5733',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF5733',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OptionScreen;

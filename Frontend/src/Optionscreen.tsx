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

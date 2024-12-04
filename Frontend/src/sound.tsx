// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';
// import axios from 'axios';
// import TrackPlayer, { usePlaybackState } from 'react-native-track-player';
// import Tts from 'react-native-tts';

// const SoundScreen = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [prediction, setPrediction] = useState('');
//   const playbackState = usePlaybackState();

//   useEffect(() => {
//     Tts.setDefaultLanguage('en-US');
//     Tts.setDefaultRate(0.45);
//     setupPlayer();
//     return () => {
//       TrackPlayer.destroy();
//     };
//   }, []);

//   const setupPlayer = async () => {
//     await TrackPlayer.setupPlayer();
//   };

//   const pickFile = async () => {
//     try {
//       const result = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio],
//       });

//       if (result && result.length > 0) {
//         const file = result[0];
//         setSelectedFile(file);
//         setPrediction('');
//         await TrackPlayer.reset();
//         await TrackPlayer.add({
//           id: '1',
//           url: file.uri,
//           title: file.name,
//         });
//         Alert.alert('Success', `Selected: ${file.name}`);
//       }
//     } catch (error) {
//       if (DocumentPicker.isCancel(error)) {
//         console.log('Picker canceled');
//       } else {
//         Alert.alert('Error', 'Could not pick the file.');
//       }
//     }
//   };

//   const predictSound = async () => {
//     if (!selectedFile) {
//       Alert.alert('No File', 'Please select a file first.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', {
//       uri: selectedFile.uri,
//       name: selectedFile.name,
//       type: selectedFile.type || 'audio/wav',
//     });

//     try {
//       const response = await axios.post('http://10.0.2.2:5000/predict', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setPrediction(response.data.prediction);
//     } catch (error) {
//       Alert.alert('Error', 'Prediction failed.');
//     }
//   };

//   const speakPrediction = () => {
//     if (prediction) {
//       Tts.speak(prediction);
//     } else {
//       Alert.alert('No Prediction', 'Please predict first.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Noise Predictor</Text>

//       <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
//         <Text style={styles.uploadText}>Choose Sound File</Text>
//       </TouchableOpacity>

//       {selectedFile && (
//         <View style={styles.fileContainer}>
//           <Text style={styles.fileName}>{selectedFile.name}</Text>

//           <TouchableOpacity
//             style={styles.playButton}
//             onPress={() =>
//               playbackState === TrackPlayer.STATE_PLAYING
//                 ? TrackPlayer.pause()
//                 : TrackPlayer.play()
//             }
//           >
//             <Text style={styles.playText}>
//               {playbackState === TrackPlayer.STATE_PLAYING ? 'Pause' : 'Play'}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <TouchableOpacity
//         style={[styles.predictButton, !selectedFile && styles.disabled]}
//         onPress={predictSound}
//         disabled={!selectedFile}
//       >
//         <Text style={styles.predictText}>Predict Sound</Text>
//       </TouchableOpacity>

//       {prediction && (
//         <View style={styles.resultContainer}>
//           <Text style={styles.resultText}>Prediction: {prediction}</Text>
//           <TouchableOpacity style={styles.speakButton} onPress={speakPrediction}>
//             <Text style={styles.speakText}>Hear Prediction</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 30,
//     backgroundColor: '#F5F5F5',
//     justifyContent: 'center',
//   },
//   heading: {
//     fontSize: 26,
//     color: '#1D3557',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   uploadButton: {
//     backgroundColor: '#457B9D',
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   uploadText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   fileContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   fileName: {
//     fontSize: 16,
//     color: '#1D3557',
//     marginBottom: 10,
//   },
//   playButton: {
//     backgroundColor: '#A8DADC',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   playText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   predictButton: {
//     backgroundColor: '#E63946',
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   disabled: {
//     backgroundColor: '#BDBDBD',
//   },
//   predictText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
//   resultContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   resultText: {
//     fontSize: 18,
//     color: '#1D3557',
//     fontWeight: 'bold',
//   },
//   speakButton: {
//     backgroundColor: '#2A9D8F',
//     marginTop: 15,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
//   speakText: {
//     color: '#FFFFFF',
//     fontSize: 16,
//   },
// });

// export default SoundScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

const SoundScreen = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [sound, setSound] = useState(null);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.45);
  }, []);

  // Function to pick a file using DocumentPicker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      if (result && result.length > 0) {
        const file = result[0];
        setSelectedFile(file);
        setPrediction('');

        // Use RNFS to copy the file to a known location
        const path = RNFS.DocumentDirectoryPath + '/' + file.name;

        // Copy file to the app's document directory
        await RNFS.copyFile(file.uri, path);

        const newSound = new Sound(path, '', (error) => {
          if (error) {
            Alert.alert('Error', 'Failed to load sound file');
          } else {
            console.log('Sound loaded successfully');
          }
        });

        setSound(newSound);
        Alert.alert('Success', `Selected: ${file.name}`);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Picker canceled');
      } else {
        Alert.alert('Error', 'Could not pick the file.');
      }
    }
  };

  // Function to predict sound
  const predictSound = async () => {
    if (!selectedFile) {
      Alert.alert('No File', 'Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', {
      uri: selectedFile.uri,
      name: selectedFile.name,
      type: selectedFile.type || 'audio/wav',
    });

    try {
      const response = await axios.post('http://10.0.2.2:5000/predict_audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      Alert.alert('Error', 'Prediction failed.');
    }
  };

  // Function to speak the prediction
  const speakPrediction = () => {
    if (prediction) {
      Tts.speak(prediction);
    } else {
      Alert.alert('No Prediction', 'Please predict first.');
    }
  };

  // Function to play the sound
  const playSound = () => {
    if (sound) {
      sound.play((success, error) => {
        if (!success) {
          console.log('Sound playback failed:', error);
          Alert.alert('Error', 'Sound playback failed');
        } else {
          console.log('Sound played successfully');
        }
      });
    } else {
      Alert.alert('No File', 'Please select a sound file first.');
    }
  };

  // Function to pause the sound
  const pauseSound = () => {
    if (sound) {
      sound.pause();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Noise Predictor</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
        <Text style={styles.uploadText}>Choose Sound File</Text>
      </TouchableOpacity>

      {selectedFile && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileName}>{selectedFile.name}</Text>

          <TouchableOpacity style={styles.playButton} onPress={playSound}>
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={pauseSound}>
            <Text style={styles.playText}>Pause</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.predictButton, !selectedFile && styles.disabled]}
        onPress={predictSound}
        disabled={!selectedFile}
      >
        <Text style={styles.predictText}>Predict Sound</Text>
      </TouchableOpacity>

      {prediction && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Prediction: {prediction}</Text>
          <TouchableOpacity style={styles.speakButton} onPress={speakPrediction}>
            <Text style={styles.speakText}>Hear Prediction</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    color: '#1D3557',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#457B9D',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#1D3557',
    marginBottom: 10,
  },
  playButton: {
    backgroundColor: '#A8DADC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
  },
  playText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  predictButton: {
    backgroundColor: '#E63946',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#BDBDBD',
  },
  predictText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    color: '#1D3557',
    fontWeight: 'bold',
  },
  speakButton: {
    backgroundColor: '#2A9D8F',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  speakText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SoundScreen;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { firebase } from "@react-native-firebase/auth";
// import { useNavigation } from '@react-navigation/native';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigation = useNavigation();

//   const handleLogin = async () => {
//     if (email === '' || password === '') {
//       Alert.alert("Please fill in all details.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await firebase.auth().signInWithEmailAndPassword(email, password);
//       setLoading(false);
//       navigation.navigate('OptionScreen');
//     } catch (error) {
//       setLoading(false);
//       Alert.alert("Invalid credentials. Please try again.");
//     }
//   };

//   return (
//     <View style={styles.view}>
//       <Text style={styles.text}>Welcome to NoiseAi</Text>

//       <TextInput
//         style={styles.inputtext}
//         placeholder="Email"
//         placeholderTextColor="black"
//         keyboardType="email-address"
//         autoCapitalize="none"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.inputtext}
//         placeholder="Password"
//         placeholderTextColor="black"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       {loading ? (
//         <ActivityIndicator size="large" color="#FF5733" />
//       ) : (
//         <TouchableOpacity style={styles.TO} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Log in</Text>
//         </TouchableOpacity>
//       )}

//       <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
//         <Text style={styles.forgotPassword}>Reset Password</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//         <Text style={styles.signupText}>
//           Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   view: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   text: {
//     color: "#FF5733", // Red color like in signup
//     fontSize: 28,
//     paddingBottom: 25,
//     fontWeight: 'bold',
//     fontFamily: 'Arial',
//   },
//   inputtext: {
//     borderWidth: 1,
//     borderRadius: 25, // Make inputs more rounded
//     height: 50,
//     width: "80%",
//     borderColor: "#FF5733", // Red color for the border
//     marginBottom: 20,
//     paddingLeft: 20,
//     fontSize: 16,
//   },
//   TO: {
//     borderRadius: 25,
//     width: "80%",
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FF5733", // Red background for the button
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: "white", // White text for better contrast
//     fontWeight: 'bold',
//   },
//   forgotPassword: {
//     fontSize: 16,
//     color: "#FF5733", // Same red color as buttons
//     marginVertical: 10,
//   },
//   signupText: {
//     fontSize: 16,
//     color: '#495057',
//     marginTop: 20,
//   },
//   signupLink: {
//     color: '#FF5733', // Same red color as buttons
//     fontWeight: 'bold',
//   },
// });


import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { firebase } from "@react-native-firebase/auth";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      // Reset fields when screen gains focus
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert("Please fill in all details.");
      return;
    }
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      navigation.navigate('OptionScreen');
    } catch (error) {
      setLoading(false);
      Alert.alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <View style={styles.view}>
      <Text style={styles.title}>Noise AI</Text>
      <Text style={styles.text}>Welcome to Noise AI</Text>

      <TextInput
        style={styles.inputtext}
        placeholder="Email"
        placeholderTextColor="black"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.inputtext}
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : (
        <TouchableOpacity style={styles.TO} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.forgotPassword}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF5733',
    marginBottom: 10,
  },
  text: {
    color: "#FF5733",
    fontSize: 28,
    paddingBottom: 25,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  inputtext: {
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    width: "80%",
    borderColor: "#FF5733",
    marginBottom: 20,
    paddingLeft: 20,
    fontSize: 16,
  },
  TO: {
    borderRadius: 25,
    width: "80%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF5733",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 16,
    color: "#FF5733",
    marginVertical: 10,
  },
  signupText: {
    fontSize: 16,
    color: '#495057',
    marginTop: 20,
  },
  signupLink: {
    color: '#FF5733',
    fontWeight: 'bold',
  },
});

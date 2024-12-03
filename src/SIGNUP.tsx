import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { firebase } from "@react-native-firebase/auth";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

// Function to validate email format using regex
const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
};

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleSignup = async () => {
        if (email === '' || username === '' || password === '') {
            Alert.alert("Please fill in all fields.");
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            Alert.alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Password should be at least 6 characters long.");
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const userId = userCredential.user.uid;

            // Save the username in Firestore
            await firestore().collection('testing').doc(userId).set({
                email,
                username
            });

            // Send email verification
            await firebase.auth().currentUser.sendEmailVerification();

            Alert.alert("Signup successful! Verification email sent.");
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert("Signup failed. Please try again.", error.message);
        }
    }

    return (
        <View style={styles.view}>
            <Text style={styles.text}>Welcome to NoiseAi</Text>

            <TextInput
                style={styles.inputtext}
                placeholder='Email'
                placeholderTextColor="black"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.inputtext}
                placeholder='Username'
                placeholderTextColor="black"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.inputtext}
                placeholder="Password"
                placeholderTextColor="black"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.TO} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signup;

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    text: {
        color: "#FF5733", // Red color like in login
        fontSize: 28,
        paddingBottom: 25,
        fontWeight: 'bold',
        fontFamily: 'Arial', // You can change to any font you like
    },
    inputtext: {
        borderWidth: 1,
        borderRadius: 25, // Make inputs more rounded
        height: 50,
        width: "80%",
        borderColor: "#FF5733", // Red color for the border
        marginBottom: 20,
        paddingLeft: 20, // Add padding inside the input field for better UX
        fontSize: 16,
    },
    TO: {
        borderRadius: 25,
        width: "80%",  // Make button width same as input fields
        height: 50,  // Same height as input fields for consistency
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF5733", // Red background for the button
        marginTop: 20,  // Adjust margin to look consistent
    },
    buttonText: {
        fontSize: 18,
        color: "white", // White text for better contrast
        fontWeight: 'bold',
    }
})

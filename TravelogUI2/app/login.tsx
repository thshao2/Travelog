import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import config from './config';

const {API_URL} = config;

// const API_URL = process.env.NODE_ENV === 'production' ? "http://18.144.165.97" : "http://localhost:8080";



// const storeToken = async (token: string, userId: string | null) => {
const storeToken = async (token: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem('token', token);
    // localStorage.setItem('userId', userId? userId : 'default userID');
  } else {
    await AsyncStorage.setItem('token', token);
    // await AsyncStorage.setItem('userId', userId? userId : 'default userID');
  }
};

const getToken = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('token');
  } else {
    return await AsyncStorage.getItem('token');
  }
};

const getUserId = async () => {
  if (Platform.OS === 'web') {
    return localStorage.getItem('userId');
  } else {
    return await AsyncStorage.getItem('userId');
  }
};

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  useEffect(() => {
    if (validateEmail(email) && password) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, password]);

  // Reset to empty form
  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );

  

  // Handle login button press
  // NEED TO CALL MICROSERVICES FUNCTION TO VALITDATE USER INPUTS
  const handleLogin = async () => {
    console.log("Submitting form: ", email, password)
    console.log(API_URL);
    try {
      // Make a POST request to /auth/login endpoint via the API Gateway
      let response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({username: 'WHY', email: email, password: password}),
          headers: {
            'Content-Type': 'application/json',
          },
      });
      // response = await response.json();
      console.log(response)
      if (response.ok) {
          console.log("I AM HERE")
          const data = await response.json();
          await storeToken(data.token);
          // try to get X-user-ID but give me null
          // await storeToken(data.token, response.headers.get('X-User-Id'));
          console.log("API Response: ", data);
          console.log(typeof(data));
          navigation.navigate('(tabs)');
      } else {
          console.error("Failed to fetch from auth-service. Status: ", response.status);
      }
  } catch (error) {
      console.log("THERE WAS AN ERROR")
      console.error("Error calling auth-service: ", error);
  }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {!validateEmail(email) && email !== '' && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable
        onPress={handleLogin}
        disabled={!isFormValid}
        style={[
          styles.loginButton,
          { backgroundColor: isFormValid ? "#4444ff" : "gray" }
        ]}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      <Text style={styles.text} >Don't have an account? <Pressable><Text style={styles.signUpText} onPress={() => navigation.navigate('signup')}>Click here to sign up!</Text></Pressable></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    color: '#4444ff',
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    color: 'gray',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signUpText: {
    color: "#4444ff",
  },
  loginButton: {
    width: "20%",
    paddingVertical: 10,
    backgroundColor: "#4444ff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LoginScreen;
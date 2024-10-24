import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const SignUpPage = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // Function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  useEffect(() => {
    if (username && validateEmail(email) && password && password === confirmPassword) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [username, email, password, confirmPassword]);

  // Reset to empty form
  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }, [])
  );

  // Handle sign-up button press
  // NEED TO CALL MICROSERVICES FUNCTION TO ADD USERS DATA TO DB
  const handleSignUp = async () => {
    console.log("submitting form: ", username, email, password)
    try {
      // Make a POST request to /auth/login endpoint via the API Gateway
      let response = await fetch('http://localhost:8080/auth/signup', {
          method: 'POST',
          body: JSON.stringify({username: username, email: email, password: password}),
          headers: {
            'Content-Type': 'application/json',
          },
      });
      // response = await response.json();
      console.log(response)
      if (response.ok) {
          console.log("I AM HERE")
          const data = await response.text();
          // await storeToken(data.token);
          console.log("API Response: ", data);
          console.log(typeof(data));
          navigation.navigate('(tabs)');
      } else {
          console.error("Failed to fetch from auth-service. Status: ", response.status);
      }
    } catch (error) {
        console.log("THERE WAS AN ERROR IN SIGNUP")
        console.error("Error calling auth-service: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!validateEmail(email) && email !== '' && (
        <Text style={styles.errorText}>Please enter a valid email address.</Text>
      )}

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
      />
      {confirmPassword !== '' && confirmPassword !== password && (
        <Text style={styles.errorText}>Passwords do not match.</Text>
      )}

      {/* Sign-Up Button */}
      <Pressable
        onPress={handleSignUp}
        disabled={!isFormValid}
        style={[
            styles.signUpButton,
            { backgroundColor: isFormValid ? "#4444ff" : "gray" }
          ]}
      >
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </Pressable>

      <Text style={styles.text}>Have an account already? <Pressable><Text style={styles.loginText} onPress={() => navigation.navigate('login')}>Click here to login!</Text></Pressable></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#4444ff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    color: 'gray',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    color: 'gray',
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  signUpButton: {
    width: "20%",
    paddingVertical: 10,
    backgroundColor: "#4444ff",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginText: {
    color: "#4444ff",
  },
});

export default SignUpPage;

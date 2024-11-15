import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import config from "./config";

import { storeToken } from "./utils/util";
import { useLoginContext } from "./context/LoginContext";

const { API_URL } = config;

// const API_URL = process.env.NODE_ENV === 'production' ? "http://18.144.165.97" : "http://localhost:8080";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const loginContext = useLoginContext();

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
      setEmail("");
      setPassword("");
    }, []),
  );

  // Handle login button press
  // NEED TO CALL MICROSERVICES FUNCTION TO VALITDATE USER INPUTS
  const handleLogin = async() => {
    console.log("Submitting form: ", email, password);
    console.log(API_URL);
    try {
      // Make a POST request to /auth/login endpoint via the API Gateway
      let response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username: "WHY", email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // response = await response.json();
      console.log(response);
      if (response.ok) {
        console.log("I AM HERE");
        const data = await response.json();
        await storeToken(data.token);
        loginContext.setAccessToken(data.token);
        loginContext.setEmail(email);
        // try to get X-user-ID but give me null
        // await storeToken(data.token, response.headers.get('X-User-Id'));
        console.log("API Response: ", data);
        console.log(typeof(data));
        navigation.navigate("(tabs)");
      } else {
        console.error("Failed to fetch from auth-service. Status: ", response.status);
      }
    } catch (error) {
      console.log("THERE WAS AN ERROR");
      console.error("Error calling auth-service: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.jpg")}
      style={styles.background}
      imageStyle={{ resizeMode: "cover" }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Travelog</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {!validateEmail(email) && email !== "" && (
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
            { backgroundColor: isFormValid ? "#328ECB" : "gray" },
          ]}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
  
        <Text style={styles.text}>
          Don't have an account?{" "}
          <Pressable onPress={() => navigation.navigate("signup")}>
            <Text style={styles.signUpText}>Click here to sign up!</Text>
          </Pressable>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "30%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#328ECB",
    borderWidth: 1,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  loginButton: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  text: {
    marginTop: 20,
    textAlign: "center",
  },
  signUpText: {
    color: "#996C96",
    fontWeight: "bold",
  },
});

export default LoginScreen;
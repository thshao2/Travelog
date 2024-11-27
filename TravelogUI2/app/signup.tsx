import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { storeToken } from "./utils/util";

import config from "./config";
import { useLoginContext } from "./context/LoginContext";

const { API_URL } = config;

const SignUpPage = () => {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState<boolean>(false);

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
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDuplicateEmail(false);
    }, []),
  );

  // Handle sign-up button press
  const handleSignUp = async() => {
    try {
      let response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({ username: username, email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setDuplicateEmail(false);
        const data = await response.json();
        await storeToken(data.token);
        loginContext.setEmail(email);
        loginContext.setAccessToken(data.token);
        navigation.navigate("index");

      } else if (response.status === 409) {
        setDuplicateEmail(true);
      } else {
        console.error("Failed to fetch from auth-service. Reponse: ", await response.text());
        setDuplicateEmail(false);
      }
    } catch (error) {
      console.error("Error calling auth-service: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/signup-bg.jpg")}
      style={styles.background}
      imageStyle={{ resizeMode: "cover" }}
    >
      {/* Sign-Up Card */}
      <View style={styles.container}>
        <Text style={styles.title}>Travelog</Text>
  
        {/* Username Input */}
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
        {!validateEmail(email) && email !== "" && (
          <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}
        {duplicateEmail && (
          <Text style={styles.errorText}>Email address has already been taken!</Text>
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
        {confirmPassword !== "" && confirmPassword !== password && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}
  
        {/* Sign-Up Button */}
        <Pressable
          onPress={handleSignUp}
          disabled={!isFormValid}
          style={[
            styles.signUpButton,
            { backgroundColor: isFormValid ? "#996C96" : "gray" },
          ]}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </Pressable>
  
        <Text style={styles.text}>
          Have an account already?{" "}
          <Pressable onPress={() => navigation.navigate("login")}>
            <Text style={styles.loginText}>Click here to login!</Text>
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
  signUpButton: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  text: {
    marginTop: 20,
    textAlign: "center",
  },
  loginText: {
    color: "#996C96",
    fontWeight: "bold",
  },
});

export default SignUpPage;

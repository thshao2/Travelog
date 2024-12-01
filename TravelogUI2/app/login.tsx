import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, Pressable, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import config from "./config";

import { storeToken, validateEmail } from "./utils/util";
import { styles } from "./styles/login-signup-styles";
import { useLoginContext } from "./context/LoginContext";

const { API_URL } = config;

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const loginContext = useLoginContext();

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
  const handleLogin = async () => {
    try {
      let response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username: "WHY", email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        await storeToken(data.token);
        loginContext.setEmail(email);
        loginContext.setAccessToken(data.token);
        navigation.navigate("index");
      } else {
        console.error("Failed to fetch from auth-service. Status: ", response.status);
      }
    } catch (error) {
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
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <Pressable
          onPress={handleLogin}
          disabled={!isFormValid}
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#328ECB" : "gray" },
          ]}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Text style={styles.text}>
          Don't have an account?
          <Pressable onPress={() => navigation.navigate("signup")}>
            <Text key="clickToSignUp" style={styles.funcText}>Click here to sign up!</Text>
          </Pressable>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
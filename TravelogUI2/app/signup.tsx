import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput, Text, Pressable, ImageBackground } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import config from "./config";

import { storeToken, validateEmail } from "./utils/util";
import { styles } from "./styles/login-signup-styles";
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

  // Handle signup button press
  const handleSignUp = async () => {
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
      <View style={styles.container}>
        <Text style={styles.title}>Travelog</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {!validateEmail(email) && email !== "" && (
          <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}
        {duplicateEmail && (
          <Text style={styles.errorText}>Email address has already been taken!</Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

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

        <Pressable
          onPress={handleSignUp}
          disabled={!isFormValid}
          style={[
            styles.button,
            { backgroundColor: isFormValid ? "#996C96" : "gray" },
          ]}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>

        <Text style={styles.text}>
          Have an account already?
          <Pressable onPress={() => navigation.navigate("login")}>
            <Text style={styles.funcText}>Click here to login!</Text>
          </Pressable>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default SignUpPage;

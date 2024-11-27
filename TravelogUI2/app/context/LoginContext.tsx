import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from "react";
import { getToken } from "../utils/util";
import { useNavigation, useRouter } from "expo-router";

import config from "../config";
const { API_URL } = config;

export const LoginContext = createContext({
  email: "",
  // eslint-disable-next-line unused-imports/no-unused-vars
  setEmail: (email: string) => { },
  accessToken: "",
  // eslint-disable-next-line unused-imports/no-unused-vars
  setAccessToken: (accessToken: string) => { },
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [email, setEmail] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const navigation = useNavigation();

  const router = useRouter();

  // Fetch token from AsyncStorage or localStorage
  useEffect(() => {
    console.log("Inside useEffect of Login Context for getting token from storage");
    const fetchToken = async() => {
      const token = await getToken();
      console.log("Token is ", token);
      if (token) {
        setAccessToken(token);
      }
    };
    fetchToken();
  }, []);

  // // Update token in storage whenever accessToken changes
  // useEffect(() => {
    
  //   const checkValidToken = async () => {
  //     const checkToken = await getToken();
  //     try {
  //       const response = await fetch(`${API_URL}/user/profile`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${checkToken}`,
  //         },
  //       });
  //       console.log(response);
  //       if (!response.ok) {
  //         setAccessToken("");
  //         setEmail("");
  //         console.log("INVALID INVALID TOKEN");
  //         navigation.navigate("login");
  //         return false;
  //       } 
  //       storeToken(accessToken);
  //       console.log("STORED TOKEN");
  //     } catch (error) {
  //       return false;
  //     }
  //   };

  //   checkValidToken();
  // }, [accessToken]);

  return (
    <LoginContext.Provider value = {{ email, setEmail, accessToken, setAccessToken }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error("You are trying to access Login Context outside of its Provider!");
  }
  return context;
};
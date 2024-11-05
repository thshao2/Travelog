import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import {getToken, storeToken} from '../utils/util';
import { useNavigation } from "@react-navigation/native";


export const LoginContext = createContext({
  email: '',
  setEmail: (email: string) => { },
  accessToken: '',
  setAccessToken: (accessToken: string) => { },
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const navigation = useNavigation();

  // Fetch token from AsyncStorage or localStorage
  useEffect(() => {
    console.log("Inside useEffect of Login Context for getting token from storage");
    const fetchToken = async () => {
      const token = await getToken();
      console.log("Token is ", token);
      if (token) {
        setAccessToken(token);
      }
    };
    fetchToken();
  }, []);

  // Update token in storage whenever accessToken changes
  useEffect(() => {
    if (accessToken) {
      storeToken(accessToken);
    } 
    // else {
    //   navigation.navigate("login")
    // }
  }, [accessToken]);

  return (
    <LoginContext.Provider value = {{email, setEmail, accessToken, setAccessToken}}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginContext = () => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('You are trying to access Login Context outside of its Provider!');
  }
  return context;
};
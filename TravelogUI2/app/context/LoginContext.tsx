import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from "react";
import { getToken } from "../utils/util";

// eslint-disable-next-line unused-imports/no-unused-imports
import config from "../config";

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

  // Fetch token from localStorage
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
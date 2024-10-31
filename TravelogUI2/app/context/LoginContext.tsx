import React, { createContext, useState, useContext, PropsWithChildren } from 'react';

export const LoginContext = createContext({
  email: '',
  setEmail: (email: string) => { },
  accessToken: '',
  setAccessToken: (accessToken: string) => { },
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [email, setEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');

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
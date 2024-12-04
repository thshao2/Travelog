import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async() => {
  if (Platform.OS === "web") {
    console.log("We are on web - inside getToken");
    const token = localStorage.getItem("token");
    console.log("Get token response: ", token);
    return token;
  } else {
    console.log("We are on mobile, inside getToken");
    return await AsyncStorage.getItem("token");
  }
};

export const storeToken = async(token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
    console.log("Inside store token, token is ", token, "and localstorage's token is now", localStorage.getItem("token"));
    // localStorage.setItem('userId', userId? userId : 'default userID');
  } else {
    await AsyncStorage.setItem("token", token);
    // await AsyncStorage.setItem('userId', userId? userId : 'default userID');
  }
};

export const removeToken = async() => {
  console.log("REMOVE TOKEN CALLED!!!!!!!");
  if (Platform.OS === "web") {
    return localStorage.removeItem("token");
  } else {
    return await AsyncStorage.removeItem("token");
  }
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (date: Date) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
};

export function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async() => {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  } else {
    return await AsyncStorage.getItem("token");
  }
};

export const storeToken = async(token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
    // localStorage.setItem('userId', userId? userId : 'default userID');
  } else {
    await AsyncStorage.setItem("token", token);
    // await AsyncStorage.setItem('userId', userId? userId : 'default userID');
  }
};

export const removeToken = async() => {
  if (Platform.OS === "web") {
    return localStorage.removeItem("token");
  } else {
    return await AsyncStorage.removeItem("token");
  }
};

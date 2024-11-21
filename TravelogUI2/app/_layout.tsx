import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import applyGlobalPolyfills from "./decoder";

import { useColorScheme } from "@/hooks/useColorScheme";
import { LoginProvider } from "./context/LoginContext";
import NavBar from "../components/NavBar";
applyGlobalPolyfills();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // const showNavBar = ["/map", "/saved", "/", "/categoryMemPage", "", "/profile"].includes(location.pathname);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      
      <LoginProvider>
        <NavBar/>

        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="map" options={{ headerShown: false }} />
          <Stack.Screen name="saved" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
          {/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="categoryMemPage" options={{ headerShown: false }}/>
        </Stack>
      </LoginProvider>
    </ThemeProvider>
  );
}

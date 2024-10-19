import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Ionicons } from "@expo/vector-icons";  // Import Ionicons for icons
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Custom header component
function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('map')}>
        {/* <Ionicons name="menu" size={24} color="black" /> */}
        Travelog
      </TouchableOpacity>

      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        placeholderTextColor="#999"
      />

      <TouchableOpacity onPress={() =>navigation.navigate('profile')}>
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }} // Replace with actual profile image URL
          style={styles.profilePic}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        header: () => <CustomHeader />, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
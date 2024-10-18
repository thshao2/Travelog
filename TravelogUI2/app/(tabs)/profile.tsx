import React from "react";
import { View, StyleSheet, Alert, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo vector-icons

export default function ProfilePage() {
  const editProfilePic = () => {
    console.log("Edit Profile Pic");
  };

  const editName = () => {
    console.log("Edit Name");
  };

  const editPassword = () => {
    console.log("Edit Password");
  };

  const logout = () => {
    console.log("Logout");
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={editProfilePic}>
         <Image
          source={{ uri: 'https://via.placeholder.com/40' }} // Replace with actual profile image URL
          style={styles.profilePic}
        />
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.name}>Name</Text>
        <MaterialIcons
          name="edit"
          size={24}
          color="black"
          onPress={editName}
          style={styles.editIcon}
        />
      </View>

      <View style={styles.row}>
      <Text style={styles.password}>Password: </Text>
        <Text style={styles.password}>********</Text>
        <MaterialIcons
          name="edit"
          size={24}
          color="black"
          onPress={editPassword}
          style={styles.editIcon}
        />
      </View>

      <View style={styles.spacer} />

      <Button
        mode="contained"
        title="Logout"
        onPress={logout}
        style={styles.logoutButton}
        color="#ff4444"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  password: {
    fontSize: 18,
  },
  editIcon: {
    marginLeft: 10,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    marginBottom: 20,
    width: "80%",
  },
});

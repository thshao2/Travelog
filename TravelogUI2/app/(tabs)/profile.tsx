import React from "react";
import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 

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

  const editBio = () => {
    console.log("Edit Bio");
  };


  const logout = () => {
    console.log("Logout");
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <Pressable onPress={editProfilePic}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }} // Replace with actual profile image URL
            style={styles.profilePic}
          />
        </Pressable>

        <View style={styles.profileDetails}>
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
            <Text style={styles.email}>Email: user@example.com</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.password}>Password: ********</Text>
            <MaterialIcons
              name="edit"
              size={24}
              color="black"
              onPress={editPassword}
              style={styles.editIcon}
            />
          </View>
        </View>
      </View>

      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Bio</Text>
          <View style={styles.row}>
            <div style={styles.bioText}>
                This is a short bio.
            </div>
            <MaterialIcons
              name="edit"
              size={24}
              color="black"
              onPress={editBio}
              style={styles.editIcon}
            />
          </View>
      </View>

      <View style={styles.spacer} />

      <Pressable
        onPress={logout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    fontSize: 18,
    color: "#333",
  },
  password: {
    fontSize: 18,
    color: "#333",
  },
  editIcon: {
    marginLeft: 10,
  },
  bioContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: "#666",
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    width: "20%",
    paddingVertical: 10,
    backgroundColor: "#ff4444",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

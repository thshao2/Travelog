import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  TextInput,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import config from "../config";
import { getToken, removeToken } from "../utils/util";
import { useLoginContext } from "../context/LoginContext";

const { API_URL } = config;

export default function ProfilePage() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      console.log("fetchProfile response: ", response);
      if (response.ok) {
        const data = await response.json();
        // Set the fetched user data as default values in the state
        setName(data.username || "Travelog User");
        setBio(data.bio || "My Travelog bio!");
        setProfilePic(data.mediaUrl || "assets/images/default-pfp.png");
      } else {
        console.error("Error fetching profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // stats state
  const [stats, setStats] = useState({continents: -1, countries: -1, cities: -1});

  const fetchStats = async (token: string) => {
    console.log('HEHREHRERE');
    try {
      const response = await fetch(`${API_URL}/travel/memory/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });

      console.log('fetchStats response: ', response);
      if (response.ok) {
        const data = await response.json();
        console.log('continents: ', data.visitedContinentCount, ' countries: ', data.visitedCountryCount, ' cities: ', data.visitedCityCount);
        setStats({
          continents: data.visitedContinentCount,
          countries: data.visitedCountryCount,
          cities: data.visitedCityCount,
        });
      } else {
        console.error("Failed to fetch stats: ", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching stats: ", error);
    }
  }

  // Fetch user profile on component mount
  useEffect(() => {
    if (loginContext.accessToken.length > 0) {
      fetchProfile(loginContext.accessToken);

      fetchStats(loginContext.accessToken);
    } else {
      navigation.navigate("login");
    }
  }, [loginContext.accessToken]);

  const toggleEditing = () => {
    if (isEditing) {
      updateProfile();
    }
    setIsEditing(!isEditing);
  };

  const updateProfile = async () => {
    const updateData: {
      username: string;
      bio: string;
      uri: string;
    } = {
      username: name,
      bio,
      uri: profilePic,
    };

    try {
      const token = await getToken(); // Use the getToken function
      const response = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
        console.log(profilePic);
      } else {
        console.error("Error updating profile:", response.statusText);
        await fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      console.log(result);
      setProfilePic(uri);
    }
  };

  const clearPasswordForm = async () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Password updated successfully");
        setShowPasswordForm(false);
        setPasswordError("");
      } else {
        console.error("Failed to update password:", response.statusText);
        setPasswordError("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Error updating password");
    }
    clearPasswordForm();
  };

  const logout = async () => {
    await removeToken();
    loginContext.setEmail("");
    loginContext.setAccessToken("");
    navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.profileRow}>
          {isEditing ? (
            <Pressable onPress={pickImage}>
              <Image
                source={{ uri: profilePic }}
                style={styles.profilePic}
              />
            </Pressable>
          ) : (
            <Image
              source={{ uri: profilePic }}
              style={styles.profilePic}
            />
          )}

          <View style={styles.profileDetails}>
            <View style={styles.row}>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text style={styles.name}>{name || "Name"}</Text>
              )}
              <MaterialIcons
                name="edit"
                size={24}
                color="black"
                onPress={toggleEditing}
                style={styles.editIcon}
              />
            </View>

          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bioTitle}>Bio</Text>
          <View style={styles.row}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="This is a short bio."
                value={bio}
                onChangeText={setBio}
                multiline
              />
            ) : (
              <Text style={styles.bioText}>
                {bio || "This is a short bio."}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <Pressable style={styles.button} onPress={toggleEditing}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
        )}

        <View style={styles.passwordSection}>
          <Pressable
            style={styles.passwordToggle}
            onPress={() => setShowPasswordForm(!showPasswordForm)}
          >
            <Text style={styles.passwordToggleText}>
              {showPasswordForm
                ? "Cancel Password Change"
                : "Change Password"}
            </Text>
          </Pressable>

          {showPasswordForm && (
            <View style={styles.passwordForm}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              {passwordError ? (
                <Text style={styles.errorText}>
                  {passwordError}
                </Text>
              ) : null}
              <Pressable
                style={styles.button}
                onPress={updatePassword}
              >
                <Text style={styles.buttonText}>
                  Update Password
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.statSectionContainer}>
          <ImageBackground
            source={require("@/assets/images/pfp-background.jpg")}
            style={styles.backgroundImageStyle}
          >
            <Text style={styles.statsText}>You have visited:</Text>
            <View style={styles.statsTextContainer}>

              <View style={styles.statsTextChunk}>
                <Text style={styles.statsNumberText}>{stats.countries}</Text>
                <Text style={styles.statsText}>countries</Text>
              </View>

              <View style={styles.statsTextChunk}>
                <Text style={styles.statsNumberText}>{stats.cities}</Text>
                <Text style={styles.statsText}>cities</Text>
              </View>

              <View style={styles.statsTextChunk}>
                <Text style={styles.statsNumberText}>{stats.continents}</Text>
                <Text style={styles.statsText}>continents</Text>
              </View>

            </View>
          </ImageBackground>
        </View>

        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    padding: 20,
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
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
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
  passwordSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  passwordToggle: {
    marginBottom: 10,
  },
  passwordToggleText: {
    color: "#007AFF",
    fontSize: 16,
  },
  passwordForm: {
    gap: 10,
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
  statSectionContainer: {
    width: "100%",
    height: 500,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  statsTextContainer: {
    width: "100%",
    height: 250,
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  statsTextHeader: {
    width: "100%",
    height: 250,
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  statsTextChunk: {
    width: "20%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "#00000F",
  },
  statsNumberText: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});
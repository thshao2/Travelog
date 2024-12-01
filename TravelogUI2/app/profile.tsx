import React, { useState, useCallback } from "react";
import { Text, View, Image, Pressable, TextInput, Alert, ImageBackground, ScrollView, Platform, Modal } from "react-native";
import { Box, Grid, Typography } from "@mui/joy";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import config from "./config";
import { getToken } from "./utils/util";
import { useLoginContext } from "./context/LoginContext";
import { styles } from "./styles/profile-styles";
import PostCard from "./postCard";
import { Journal } from "./popupMenu";
const { API_URL } = config;

export default function ProfilePage() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [_memories, setMemories] = useState<Journal[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [base64, setBase] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setName(data.username || "Travelog User");
        setBio(data.bio || "My Travelog bio!");
        setProfilePic(data.avatarMediaId);
      } else {
        console.error("Error fetching profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  // stats state
  const [stats, setStats] = useState({ continents: 0, countries: 0, cities: 0 });

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("continents: ", data.visitedContinentCount, " countries: ", data.visitedCountryCount, " cities: ", data.visitedCityCount);
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
  };

  const fetchUserMemories = async () => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      } else {
        setError("Failed to fetch memories.");
      }

    } catch (err) {
      setError("Error fetching memories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on component mount
  // useEffect(() => {
  //   if (loginContext.accessToken.length > 0) {
  //     fetchProfile();
  //     fetchUserMemories();
  //     fetchStats();
  //   } else {
  //     console.log(`HERE IS TOKEN: ${loginContext.accessToken}`);
  //     navigation.navigate("login");
  //   }
  // }, [loginContext.accessToken]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      fetchStats();
      fetchUserMemories();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginContext.accessToken]),
  );

  const handleRefetch = () => {
    fetchUserMemories();
    fetchStats();
  };

  const toggleEditing = () => {
    if (isEditing) {
      updateProfile();
    }
    setIsEditing(!isEditing);
  };

  const updateProfile = async () => {
    const formData = new FormData();
    formData.append("username", name);
    formData.append("bio", bio);

    // Add the profile image file if it exists
    if (base64 !== "" && profilePic) {
      formData.append("image", base64);
    }

    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: "PUT",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Profile updated successfully");
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

      let base64 = "";

      if (Platform.OS === "web") {
        // Web: fetch the image and convert to Base64
        const response = await fetch(uri);
        const blob = await response.blob();

        // Convert blob to Base64
        base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob); // Read the blob as a data URL
        });
      } else {
        // Mobile: use FileSystem to get Base64 string
        base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      if (base64 !== "") {
        setBase(base64);
      }
    }
  };

  const openPasswordForm = () => {
    setShowPasswordForm(true);
    clearPasswordForm();
  };

  const closePasswordForm = () => {
    setShowPasswordForm(false);
    clearPasswordForm();
  };

  const clearPasswordForm = async () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
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
        closePasswordForm();
      } else {
        console.error("Failed to update password:", response.statusText);
        setPasswordError("Incorrect current password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Error updating password");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.profileContainer}>
      <ImageBackground
        source={require("../assets/images/pfp-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      />

      <View style={styles.profileInfo}>
        <Pressable onPress={isEditing ? pickImage : undefined}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        </Pressable>
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.profileName}>{name || "Your Name"}</Text>
        )}

        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Write your bio"
            value={bio}
            onChangeText={setBio}
          />
        ) : (
          <Text style={styles.bioText}>{bio || "This is your bio"}</Text>
        )}

        {isEditing ?
          <View>
            <Pressable onPress={openPasswordForm} style={styles.button}>
              <Text style={styles.buttonText}>Change Password</Text>
            </Pressable>
            <Pressable onPress={toggleEditing} style={styles.button}>
              <Text style={styles.buttonText}>
                Save Changes
              </Text>
            </Pressable>
          </View>
          :
          <Pressable onPress={toggleEditing} style={styles.button}>
            <Text style={styles.buttonText}>
              Edit Profile
            </Text>
          </Pressable>
        }
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.continents}</Text>
          <Text style={styles.statLabel}>Continents</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.countries}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stats.cities}</Text>
          <Text style={styles.statLabel}>Cities</Text>
        </View>
      </View>

      {_memories.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <Typography level="h4" sx={{ mb: 2 }}>
            Start your journey!
          </Typography>
          <Pressable onPress={() => navigation.navigate("map")}>
            <Typography
              level="h4"
              sx={{ color: "blue", textDecoration: "underline" }}
            >
              Go to Map
            </Typography>
          </Pressable>
        </Box>
      ) : (
        <Box sx={{ alignSelf: "center" }} style={{ width: "90%" }}>
          <Grid container spacing={1} >
            {_memories.map((journal) => (
              <Grid key={journal.id} xs={12} sm={12} md={6}>
                <PostCard onRefetch={handleRefetch} journal={journal} user={name} edit={true} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Modal visible={showPasswordForm} animationType="slide" transparent={true} onRequestClose={closePasswordForm}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <Pressable onPress={updatePassword} style={styles.button}>
              <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable onPress={closePasswordForm} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
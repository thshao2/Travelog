import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, Pressable, TextInput, Alert } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import config from '../config';
import { getToken } from "../utils/util";

const {API_URL} = config;

export default function ProfilePage() {
  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState('assets/images/default-pfp.png');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');


  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getToken(); // Use the getToken function
        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          // Set the fetched user data as default values in the state
          setName(data.username);
          setEmail(data.email);
          setBio(data.bio);
          setProfilePic(data.mediaUrl || 'assets/images/default-pfp.png');
        } else {
          console.error('Error fetching profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const toggleEditing = () => {
    if (isEditing) {
      // Call API to update values in the database
      updateProfile();
    }
    setIsEditing(!isEditing);
  };

  const updateProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
          bio,
        }),
      });

      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        console.error('Error updating profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
      setProfilePic(uri);
    }
  };

  const logout = () => {
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.name}>{name || 'Name'}</Text>
            )}
            <MaterialIcons
              name="edit"
              size={24}
              color="black"
              onPress={toggleEditing}
              style={styles.editIcon}
            />
          </View>

          <View style={styles.row}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.email}>Email: {email || 'user@example.com'}</Text>
            )}
          </View>

          <View style={styles.row}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            ) : (
              <Text style={styles.password}>Password: {password || '********'}</Text>
            )}
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
            <Text style={styles.bioText}>{bio || 'This is a short bio.'}</Text>
          )}
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
  input: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 5,
  },
});

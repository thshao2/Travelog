import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, Image, Pressable, TextInput, Alert, ImageBackground, ScrollView, Platform } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
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
      console.log("fetchProfile response: ", response);
      if (response.ok) {
        const data = await response.json();
        // Set the fetched user data as default values in the state
        console.log(data);
        setName(data.username || "Travelog User");
        setBio(data.bio || "My Travelog bio!");
        setProfilePic(data.avatarMediaId);
        console.log(data.avatarMediaId);
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

      // console.log("fetchStats response: ", response);
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

  // Fetch user profile on component mount
  useEffect(() => {
    if (loginContext.accessToken.length > 0) {
      fetchProfile();

      fetchStats();
    } else {
      console.log(`HERE IS TOKEN: ${loginContext.accessToken}`);
      // navigation.navigate("login");
    }
  }, [loginContext.accessToken]);

  useFocusEffect(
    useCallback(() => {
      console.log("FETCHINNNN");
      fetchStats();
    }, [loginContext.accessToken]),
  );

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

    console.log(profilePic);

    // Add the profile image file if it exists
    if (base64 !== "" && profilePic) {
      formData.append("image", base64);
    }

    // const formData = {
    //   username: name,
    //   bio: bio,
    //   image: base64, // Sending Base64 image
    // };

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
    <ScrollView contentContainerStyle={styles.profileContainer}>
    <ImageBackground
        source={require("../../assets/images/pfp-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
    >

        {/* Profile Picture and Info */}
        <View style={styles.profileInfo}>
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
            {isEditing ? (
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text style={styles.profileName}>{name || "Name"}</Text>
            )}
            <View style={styles.bioContainer}>
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
        

        <View>
          {isEditing ? (
            <Pressable onPress={toggleEditing} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            ) : (
              <Pressable onPress={toggleEditing} style={styles.button}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable>
            )}
        </View>

        <View style={styles.passwordSection}>
        <Pressable onPress={() => setShowPasswordForm(!showPasswordForm)} style={styles.button}>
              <Text style={styles.buttonText}>{showPasswordForm
                ? "Cancel Changes"
                : "Change Password"}</Text>
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
                placeholder="Confirm Password"
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
                  Update
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ImageBackground>
    
    {/* Statistics */}
    <View style={styles.statsContainer}>
        <Text style={styles.statTitle}>Visited</Text>
        <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.continents}</Text>
            <Text style={styles.statLabel}>continents</Text>
        </View>
        <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.countries}</Text>
            <Text style={styles.statLabel}>countries</Text>
        </View>
        <View style={styles.stat}>
            <Text style={styles.statValue}>{stats.cities}</Text>
            <Text style={styles.statLabel}>cities</Text>
        </View>
    </View>

    <View style={styles.logoutContainer}>
        <Pressable onPress={logout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
    </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
      flexGrow: 1,
      alignItems: "center",
      backgroundColor: "#000000"
      // justifyContent: "center",
  },
  background: {
      width: "100%",
      height: "auto",
      // height: "90%",
      alignItems: "center",
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicContainer:{
    alignContent: "center",
    justifyContent: "center"
  },
  profilePic: {
    alignItems: 'center',
      width: 120,
      height: 120,
      borderRadius: 50,
  },
  profileName: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
      marginVertical: 10,
  },
  bioContainer: {
      marginBottom: 16,
  },
  bioText: {
      fontSize: 16,
      color: "#ffffff",
      textAlign: "center",
  },
  icon: {
    color: "#ffffff",
    marginLeft: 10,
  },
  password: {
    fontSize: 18,
    color: "#ffffff",
  },
  passwordSection: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  passwordToggle: {
    // marginBottom: 10,
  },
  passwordToggleText: {
    color: "#ffffff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#000000",
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  passwordForm: {
    padding: 10,
    backgroundColor: "#2c2b3b",
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
  },
  statsContainer: {
      padding: 20,
      width: "90%",
      maxWidth: 500,
      backgroundColor: "#2c2b3b",
      borderRadius: 5,
      margin: 10,
      justifyContent: "center"
  },
  statTitle: {
      fontSize: 18,
      color: "#ffffff",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
  },
  stat: {
      flexDirection: "row",
      justifyContent: "space-between",
      color: "#ffffff",
      paddingVertical: 5,
  },
  statValue: {
      fontSize: 20,
      color: "#ffffff",
      fontWeight: "bold",
  },
  statLabel: {
      fontSize: 16,
      color: "#888",
  },
  logoutContainer: {
    marginTop: 'auto',
  },
  logoutButton: {
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: "center",
    padding: 20,
    margin: 20
  },
  logoutButtonText: {
    color: '#000000',
    fontSize: 5,
    fontWeight: "bold"
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   Pressable,
//   TextInput,
//   Alert,
//   ImageBackground,
//   ScrollView,
//   Platform,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import config from "../config";
// import { getToken, removeToken } from "../utils/util";
// import { useLoginContext } from "../context/LoginContext";

// const { API_URL } = config;

// export default function ProfilePage() {
//   const navigation = useNavigation();
//   const loginContext = useLoginContext();

//   const [isEditing, setIsEditing] = useState(false);
//   const [profilePic, setProfilePic] = useState("");
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");

//   // Password state
//   const [showPasswordForm, setShowPasswordForm] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [base64, setBase] = useState("");

//   const fetchProfile = async () => {
//     try {
//       const response = await fetch(`${API_URL}/user/profile`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${loginContext.accessToken}`,
//         },
//       });
//       console.log("fetchProfile response: ", response);
//       if (response.ok) {
//         const data = await response.json();
//         // Set the fetched user data as default values in the state
//         console.log(data);
//         setName(data.username || "Travelog User");
//         setBio(data.bio || "My Travelog bio!");
//         setProfilePic(data.avatarMediaId);
//         console.log(data.avatarMediaId);
//       } else {
//         console.error("Error fetching profile:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//     }
//   };

//   // stats state
//   const [stats, setStats] = useState({ continents: 0, countries: 0, cities: 0 });

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${API_URL}/travel/memory/stats`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${loginContext.accessToken}`,
//         },
//       });

//       // console.log("fetchStats response: ", response);
//       if (response.ok) {
//         const data = await response.json();
//         console.log("continents: ", data.visitedContinentCount, " countries: ", data.visitedCountryCount, " cities: ", data.visitedCityCount);
//         setStats({
//           continents: data.visitedContinentCount,
//           countries: data.visitedCountryCount,
//           cities: data.visitedCityCount,
//         });
//       } else {
//         console.error("Failed to fetch stats: ", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching stats: ", error);
//     }
//   };

//   // Fetch user profile on component mount
//   useEffect(() => {
//     if (loginContext.accessToken.length > 0) {
//       fetchProfile();

//       fetchStats();
//     } else {
//       console.log(`HERE IS TOKEN: ${loginContext.accessToken}`);
//       // navigation.navigate("login");
//     }
//   }, [loginContext.accessToken]);

//   useFocusEffect(
//     useCallback(() => {
//       console.log("FETCHINNNN");
//       fetchStats();
//     }, [loginContext.accessToken]),
//   );

//   const toggleEditing = () => {
//     if (isEditing) {
//       updateProfile();
//     }
//     setIsEditing(!isEditing);
//   };

//   const updateProfile = async () => {
//     const formData = new FormData();
//     formData.append("username", name);
//     formData.append("bio", bio);

//     console.log(profilePic);

//     // Add the profile image file if it exists
//     if (base64 !== "" && profilePic) {
//       formData.append("image", base64);
//     }

//     // const formData = {
//     //   username: name,
//     //   bio: bio,
//     //   image: base64, // Sending Base64 image
//     // };

//     try {
//       const response = await fetch(`${API_URL}/user/update`, {
//         method: "PUT",
//         headers: {
//           // "Content-Type": "application/json",
//           Authorization: `Bearer ${loginContext.accessToken}`,
//         },
//         body: formData,
//       });

//       if (response.ok) {
//         console.log("Profile updated successfully");
//       } else {
//         console.error("Error updating profile:", response.statusText);
//         await fetchProfile();
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   const pickImage = async () => {
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       Alert.alert("Permission to access camera roll is required!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const { uri } = result.assets[0];
//       console.log(result);
//       setProfilePic(uri);

//       let base64 = "";

//       if (Platform.OS === "web") {
//         // Web: fetch the image and convert to Base64
//         const response = await fetch(uri);
//         const blob = await response.blob();
  
//         // Convert blob to Base64
//         base64 = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
//           reader.onerror = reject;
//           reader.readAsDataURL(blob); // Read the blob as a data URL
//         });
//       } else {
//         // Mobile: use FileSystem to get Base64 string
//         base64 = await FileSystem.readAsStringAsync(uri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });
//       }

//       if (base64 !== "") {
//         setBase(base64);
//       }
//     }

//   };

//   const clearPasswordForm = async () => {
//     setCurrentPassword("");
//     setNewPassword("");
//     setConfirmPassword("");
//   };

//   const updatePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       setPasswordError("Passwords do not match");
//       return;
//     }

//     try {
//       const token = await getToken();
//       const response = await fetch(`${API_URL}/auth/update-password`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           currentPassword,
//           newPassword,
//         }),
//       });

//       if (response.ok) {
//         Alert.alert("Success", "Password updated successfully");
//         setShowPasswordForm(false);
//         setPasswordError("");
//       } else {
//         console.error("Failed to update password:", response.statusText);
//         setPasswordError("Failed to update password");
//       }
//     } catch (error) {
//       console.error("Error updating password:", error);
//       setPasswordError("Error updating password");
//     }
//     clearPasswordForm();
//   };

//   const logout = async () => {
//     await removeToken();
//     loginContext.setEmail("");
//     loginContext.setAccessToken("");
//     navigation.navigate("login");
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//         <View style={styles.profileRow}>
//           {isEditing ? (
//             <Pressable onPress={pickImage}>
//               <Image
//                 source={{ uri: profilePic }}
//                 style={styles.profilePic}
//               />
//             </Pressable>
//           ) : (
//             <Image
//               source={{ uri: profilePic }}
//               style={styles.profilePic}
//             />
//           )}

//           <View style={styles.profileDetails}>
//             <View style={styles.row}>
//               {isEditing ? (
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Name"
//                   value={name}
//                   onChangeText={setName}
//                 />
//               ) : (
//                 <Text style={styles.name}>{name || "Name"}</Text>
//               )}
//               <MaterialIcons
//                 name="edit"
//                 size={24}
//                 color="black"
//                 onPress={toggleEditing}
//                 style={styles.editIcon}
//               />
//             </View>

//           </View>
//         </View>

//         <View style={styles.bioContainer}>
//           <Text style={styles.bioTitle}>Bio</Text>
//           <View style={styles.row}>
//             {isEditing ? (
//               <TextInput
//                 style={styles.input}
//                 placeholder="This is a short bio."
//                 value={bio}
//                 onChangeText={setBio}
//                 multiline
//               />
//             ) : (
//               <Text style={styles.bioText}>
//                 {bio || "This is a short bio."}
//               </Text>
//             )}
//           </View>
//         </View>

//         {isEditing && (
//           <Pressable style={styles.button} onPress={toggleEditing}>
//             <Text style={styles.buttonText}>Save Profile</Text>
//           </Pressable>
//         )}

//         <View style={styles.passwordSection}>
//           <Pressable
//             style={styles.passwordToggle}
//             onPress={() => setShowPasswordForm(!showPasswordForm)}
//           >
//             <Text style={styles.passwordToggleText}>
//               {showPasswordForm
//                 ? "Cancel Password Change"
//                 : "Change Password"}
//             </Text>
//           </Pressable>

//           {showPasswordForm && (
//             <View style={styles.passwordForm}>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Current Password"
//                 value={currentPassword}
//                 onChangeText={setCurrentPassword}
//                 secureTextEntry
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChangeText={setNewPassword}
//                 secureTextEntry
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm New Password"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 secureTextEntry
//               />
//               {passwordError ? (
//                 <Text style={styles.errorText}>
//                   {passwordError}
//                 </Text>
//               ) : null}
//               <Pressable
//                 style={styles.button}
//                 onPress={updatePassword}
//               >
//                 <Text style={styles.buttonText}>
//                   Update Password
//                 </Text>
//               </Pressable>
//             </View>
//           )}
//         </View>

//         <View style={styles.statSectionContainer}>
//           <ImageBackground
//             source={require("@/assets/images/pfp-background.jpg")}
//             style={styles.backgroundImageStyle}
//           >
//             <Text style={styles.statsText}>You have visited:</Text>
//             <View style={styles.statsTextContainer}>

//               <View style={styles.statsTextChunk}>
//                 <Text style={styles.statsNumberText}>{stats.countries}</Text>
//                 <Text style={styles.statsText}>countries</Text>
//               </View>

//               <View style={styles.statsTextChunk}>
//                 <Text style={styles.statsNumberText}>{stats.cities}</Text>
//                 <Text style={styles.statsText}>cities</Text>
//               </View>

//               <View style={styles.statsTextChunk}>
//                 <Text style={styles.statsNumberText}>{stats.continents}</Text>
//                 <Text style={styles.statsText}>continents</Text>
//               </View>

//             </View>
//           </ImageBackground>
//         </View>

//         <Pressable onPress={logout} style={styles.logoutButton}>
//           <Text style={styles.logoutButtonText}>Logout</Text>
//         </Pressable>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f5f5f5",
//   },
//   scrollViewContent: {
//     padding: 20,
//   },
//   profileRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   profilePic: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginRight: 20,
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   profileDetails: {
//     flex: 1,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   email: {
//     fontSize: 18,
//     color: "#333",
//   },
//   password: {
//     fontSize: 18,
//     color: "#333",
//   },
//   passwordSection: {
//     marginTop: 20,
//     paddingHorizontal: 10,
//   },
//   passwordToggle: {
//     marginBottom: 10,
//   },
//   passwordToggleText: {
//     color: "#007AFF",
//     fontSize: 16,
//   },
//   passwordForm: {
//     gap: 10,
//   },
//   editIcon: {
//     marginLeft: 10,
//   },
//   bioContainer: {
//     marginTop: 20,
//     paddingHorizontal: 10,
//   },
//   bioTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   bioText: {
//     fontSize: 16,
//     color: "#666",
//   },
//   spacer: {
//     flex: 1,
//   },
//   statSectionContainer: {
//     width: "100%",
//     height: 500,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   statsTextContainer: {
//     width: "100%",
//     height: 250,
//     justifyContent: "space-around",
//     alignItems: "center",
//     flexWrap: "wrap",
//     flexDirection: "row",
//   },
//   statsTextHeader: {
//     width: "100%",
//     height: 250,
//     justifyContent: "space-around",
//     alignItems: "center",
//     flexWrap: "wrap",
//     flexDirection: "row",
//   },
//   statsTextChunk: {
//     width: "20%",
//     height: 250,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   statsText: {
//     fontSize: 16,
//     color: "#FFFFFF",
//     backgroundColor: "#00000F",
//   },
//   statsNumberText: {
//     fontSize: 100,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   backgroundImageStyle: {
//     width: "100%",
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoutButton: {
//     width: "20%",
//     paddingVertical: 10,
//     backgroundColor: "#ff4444",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   logoutButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 18,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//     padding: 5,
//   },
//   errorText: {
//     color: "red",
//     marginTop: 5,
//   },
// });
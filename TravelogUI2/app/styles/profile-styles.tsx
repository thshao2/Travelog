import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
    backgroundColor: "#F5F5F5",
    // paddingBottom: 20,
  },
  background: {
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginTop: -100, // To overlap the profile picture
    padding: 10,
    backgroundColor: "#FFF",
    // borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#FFF",
    marginTop: -80,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  bioText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 15,
  },
  passwordForm: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#328ECB",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    // width: "20%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  statsContainer: {
    width: "90%",
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  passwordSection: {
    marginVertical: 20,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#FFF",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  logoutContainer: {
    marginTop: "auto", // Push to the bottom
    marginBottom: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

// import { StyleSheet } from "react-native";

// export const styles = StyleSheet.create({
//   profileContainer: {
//     flexGrow: 1,
//     alignItems: "center",
//     backgroundColor: "#000000",
//     // justifyContent: "center",
//   },
//   background: {
//     width: "100%",
//     height: "auto",
//     // height: "90%",
//     alignItems: "center",
//   },
//   profileInfo: {
//     alignItems: "center",
//     padding: 20,
//   },
//   profilePicContainer: {
//     alignContent: "center",
//     justifyContent: "center",
//   },
//   profilePic: {
//     alignItems: "center",
//     width: 120,
//     height: 120,
//     borderRadius: 50,
//   },
//   profileName: {
//     color: "#ffffff",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginVertical: 10,
//   },
//   bioContainer: {
//     marginBottom: 16,
//   },
//   bioText: {
//     fontSize: 16,
//     color: "#ffffff",
//     textAlign: "center",
//   },
//   icon: {
//     color: "#ffffff",
//     marginLeft: 10,
//   },
//   password: {
//     fontSize: 18,
//     color: "#ffffff",
//   },
//   passwordSection: {
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   passwordToggle: {
//     // marginBottom: 10,
//   },
//   passwordToggleText: {
//     color: "#ffffff",
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#ffffff",
//     padding: 8,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "#000000",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   input: {
//     backgroundColor: "#000000",
//     color: "#ffffff",
//     fontSize: 16,
//     textAlign: "center",
//     margin: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   passwordForm: {
//     padding: 10,
//     backgroundColor: "#2c2b3b",
//     borderRadius: 5,
//     marginTop: 10,
//     justifyContent: "center",
//   },
//   statsContainer: {
//     padding: 20,
//     width: "90%",
//     maxWidth: 500,
//     backgroundColor: "#2c2b3b",
//     borderRadius: 5,
//     margin: 10,
//     justifyContent: "center",
//   },
//   statTitle: {
//     fontSize: 18,
//     color: "#ffffff",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   stat: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     color: "#ffffff",
//     paddingVertical: 5,
//   },
//   statValue: {
//     fontSize: 20,
//     color: "#ffffff",
//     fontWeight: "bold",
//   },
//   statLabel: {
//     fontSize: 16,
//     color: "#888",
//   },
//   logoutContainer: {
//     marginTop: "auto",
//   },
//   logoutButton: {
//     paddingVertical: 15,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     borderRadius: 10,
//     justifyContent: "center",
//     padding: 20,
//     margin: 20,
//   },
//   logoutButtonText: {
//     color: "#000000",
//     fontSize: 5,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     marginTop: 5,
//   },
// });
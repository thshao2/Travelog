import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  profileContainer: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#000000",
    // justifyContent: "center",
  },
  background: {
    width: "100%",
    height: "auto",
    // height: "90%",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    padding: 20,
  },
  profilePicContainer: {
    alignContent: "center",
    justifyContent: "center",
  },
  profilePic: {
    alignItems: "center",
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
    justifyContent: "center",
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
    marginTop: "auto",
  },
  logoutButton: {
    paddingVertical: 15,
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
    padding: 20,
    margin: 20,
  },
  logoutButtonText: {
    color: "#000000",
    fontSize: 5,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});
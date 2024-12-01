import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  bottomNavigationContainer: {
    position: "absolute",
    top: 60,
    right: 10,
  },
  navBar: {
    backgroundColor: "white",
    borderRadius: 25,
    height: 60,
    marginBottom: 10, // Add padding to avoid text cut-off
  },
  plusButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensures the button stays on top of the map
  },
  plusButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});
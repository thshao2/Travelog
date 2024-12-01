import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  popupMenu: {
    position: "absolute",
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  journalButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  journalButtonText: {
    fontSize: 16,
  },
  noMemoriesText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
    marginVertical: 10,
  },
  menuButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  menuButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
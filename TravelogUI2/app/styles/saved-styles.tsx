import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "95%",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%",
    padding: 20,
    backgroundColor: "#4E5BA6",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
  },
  iconBackground: {
    position: "absolute",
    color: "rgba(255, 255, 255, 0.2)",
    margin: -20,
    zIndex: 0,
  },
  categoryButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    zIndex: 1,
  },
});
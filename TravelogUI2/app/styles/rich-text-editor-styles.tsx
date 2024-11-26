import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editor: {
    maxHeight: 400,
  },
  section: {
    marginVertical: 8,
  },
  textInput: {
    minHeight: 120, // Increased from 40 to 120
    fontSize: 16,
    lineHeight: 24,
    padding: 12, // Increased from 8 to 12
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    marginBottom: 16, // Added margin bottom
    textAlignVertical: "top", // Ensures text starts from top
  },
  gridContainer: {
    marginVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 4,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    margin: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gridImage: {
    resizeMode: "cover",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#86efac",
  },
  addImageText: {
    marginLeft: 8,
    color: "#4CAF50",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Added to ensure proper positioning
  },
  previewImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain", // Changed to contain to show full image
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 2, // Ensure it's above the image
  },
});
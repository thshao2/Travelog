import { StyleSheet, Dimensions } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  detailText: {
    fontWeight: "400",
  },
  blogContainer: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  journalBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  imageWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  image: {
    backgroundColor: "#f0f0f0",
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
  },
  previewImage: {
    width: screenWidth,
    height: screenWidth,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
});

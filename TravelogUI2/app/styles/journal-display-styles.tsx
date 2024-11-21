import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  detailsSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#4a5568",
  },
  detailText: {
    fontWeight: "400",
    color: "#2d3748",
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
    color: "#2d3748",
    marginVertical: 8,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    padding: 4,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  imageWrapper: {
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
  image: {
    width: 600,
    height: 500,
    borderRadius: 8,
  },
});

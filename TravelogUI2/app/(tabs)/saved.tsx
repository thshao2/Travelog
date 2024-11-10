import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import config from "../config";
import { useLoginContext } from "../context/LoginContext";
import { Ionicons } from "@expo/vector-icons";

const { API_URL } = config;

interface CategoryButtonProps {
  label: string;
}

export default function SavedPage() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();
  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async() => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Error fetching categories:", response.statusText);
        navigation.navigate("login");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [loginContext.accessToken]),
  );

  const handleCategoryPress = (category: string) => {
    navigation.navigate("categoryMemPage", { category });
  };

  const CategoryButton: React.FC<CategoryButtonProps> = ({ label }) => (
    <Pressable style={styles.categoryButton} onPress={() => handleCategoryPress(label)}>
      <Ionicons
        name="earth-outline"
        size={150}
        style={styles.iconBackground}
      />
      <Text style={styles.categoryButtonText}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Lists</Text>
      <View style={styles.gridContainer}>
        <CategoryButton key={"All"} label="All" />
        {categories.map((category) => (
          <CategoryButton key={category} label={category} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

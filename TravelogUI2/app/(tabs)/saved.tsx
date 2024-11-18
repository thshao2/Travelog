import React, { useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import config from "../config";
import { useLoginContext } from "../context/LoginContext";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/saved-styles";

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


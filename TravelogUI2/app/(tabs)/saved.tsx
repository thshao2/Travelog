import React, { useState, useCallback, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import config from '../config';
import { useLoginContext } from "../context/LoginContext";

const { API_URL } = config;

export default function SavedPage() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();
  const token = loginContext.accessToken;

  const [categories, setCategories] = useState<string[]>([]);

  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/travel/memory/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Error fetching categories:', response.statusText);
        navigation.navigate('login');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCategories(token);
    }, [token])
  );


  const handleCategoryPress = (category: string) => {
    navigation.navigate('categoryMemPage', { category });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>My Lists</Text>
      <Pressable
          key={'All'}
          style={styles.categoryButton}
          onPress={() => handleCategoryPress('All')}
        >
          <Text style={styles.categoryButtonText}>All</Text>
      </Pressable>
      {categories.map((category) => (
        <Pressable
          key={category}
          style={styles.categoryButton}
          onPress={() => handleCategoryPress(category)}
        >
          <Text style={styles.categoryButtonText}>{category}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "grey",
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  categoryButtonText: {
    color: "black",
    fontSize: 16,
  },
});
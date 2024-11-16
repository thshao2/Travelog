import React, { useState, useRef, useCallback } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, ImageBackground } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useLoginContext } from "./context/LoginContext";
import config from "./config";

const { API_URL } = config;

export default function CategoryList() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();
  const [categories, setCategories] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const fetchCategories = async () => {
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
        // navigation.navigate("login");
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

  const CategoryButton: React.FC<{ label: string }> = ({ label }) => (
    <Pressable style={styles.categoryButton} onPress={() => handleCategoryPress(label)}>
      <ImageBackground
        source={require("../assets/images/login-bg.jpg")}
        style={styles.background}
        imageStyle={{ resizeMode: "cover" }}
      >
        <Text style={styles.categoryButtonText}>{label}</Text>
      </ImageBackground>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lists</Text>
      <FlatList
        ref={flatListRef}
        data={["All", ...categories]}
        renderItem={({ item }) => <CategoryButton label={item} />}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  flatList: {
    maxWidth: "80%",
    flexGrow: 0,
  },
  categoryButton: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  background: {
    height: "100%",
    width: "100%",
  },
  categoryButtonText: {
    color: "white",
    fontWeight: "bold",
    top: 10,
    alignSelf: "center",
  },
});

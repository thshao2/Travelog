// import React from "react";
// import { Text, StyleSheet, View, Pressable } from "react-native";
// import Svg, { Path } from "react-native-svg";

// const PuzzlePiece: React.FC<{ color: string; onPress: () => void; label: string; x: number; y: number }> = ({
//   color,
//   onPress,
//   label,
//   x,
//   y,
// }) => (
//   <Pressable
//     style={[styles.puzzleContainer, { position: "absolute", left: x, top: y }]}
//     onPress={onPress}
//   >
//     <Svg width="300" height="300" viewBox="0 0 100 100">
//       {/* Example puzzle shape with interlocking edges */}
//       <Path
//       d="M0 0 L100 0 L100 100 L0 100 Z"
//         fill={color}
//         stroke="black"
//         strokeWidth="2"
//       />
//     </Svg>
//     <Text style={styles.puzzleLabel}>{label}</Text>
//   </Pressable>
// );

// export default function CategoryList() {
//   const categories = ["All", "Work", "Travel", "Hobbies", "Friends"];
//   const colors = ["#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1"]; // Example color palette

//   const positions = [
//     { x: 0, y: 0 },
//     { x: 150, y: 0 },
//     { x: 75, y: 150 },
//     { x: 225, y: 150 },
//     { x: 0, y: 300 },
//   ]; // Define positions to interlock pieces

//   const handleCategoryPress = (category: string) => {
//     console.log(`Navigating to category: ${category}`);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Categories</Text>
//       <View style={{ position: "relative", width: 400, height: 400 }}>
//         {categories.map((category, index) => (
//           <PuzzlePiece
//             key={index}
//             label={category}
//             color={colors[index % colors.length]}
//             x={positions[index].x}
//             y={positions[index].y}
//             onPress={() => handleCategoryPress(category)}
//           />
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     color: "black",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   puzzleContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     width: 150,
//     height: 150,
//   },
//   puzzleLabel: {
//     position: "absolute",
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//     top: "40%",
//     width: "100%",
//   },
// });

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
        console.log("category list data ", data);
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
      <Text style={styles.title}>LISTS</Text>
      <FlatList
        ref={flatListRef}
        // data={["All", ...categories]}
        data={["All", ...categories.filter((category) => category !== "")]} 
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
    padding: 30,
  },
  title: {
    color: "black",
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
    color: "black",
    fontWeight: "bold",
    top: 10,
    alignSelf: "center",
  },
});

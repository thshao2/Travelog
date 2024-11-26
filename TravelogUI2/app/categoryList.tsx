import React, { useState, useContext } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { LoginContext } from "./context/LoginContext";
import config from "./config";
const { API_URL } = config;

const screenWidth = Dimensions.get("window").width;

const GRADIENT_PALETTE = [
  ["#93ccf9", "#996c96"],
  ["#e18ca0", "#328ecb"],
  ["#fcc7b5", "#93ccf9"],
  ["#996c96", "#e18ca0"],
  ["#328ecb", "#fcc7b5"],
];

const PuzzlePiece: React.FC<{ gradientColors: string[]; onPress: () => void; label: string; index: number }> = ({
  gradientColors,
  onPress,
  label,
  index,
}) => (
  <Pressable style={styles.puzzleContainer} onPress={onPress}>
    <Svg width="150" height="150" viewBox="0 0 10 10">
      <Defs>
        <LinearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="1" />
          <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Path
        d="M 0 0 L 8 0 L 8 1 L 8 3 A 1.42 1.42 0 0 1 8 6 V 9 T 0 9 V 6 A 1 1 0 0 0 0 3"
        fill={`url(#grad-${index})`}
        stroke="#000"
        strokeWidth={0.1}
      />
    </Svg>
    <Text style={styles.puzzleLabel}>{label}</Text>
  </Pressable>
);

export default function CategoryList() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loginContext = useContext(LoginContext);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true); // Show loading indicator
      const response = await fetch(`${API_URL}/travel/memory/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Category list data:", data);
        setCategories(data);
      } else {
        console.error("Error fetching categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle category press
  const handleCategoryPress = (category: string) => {
    navigation.navigate("categoryMemPage", { category });
  };

  // Refetch categories on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [loginContext.accessToken]),
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={[styles.flatListWrapper, { width: screenWidth * 0.7 }]}>
        <FlatList
          data={["All", ...categories.filter((category) => category !== "")]} 
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <PuzzlePiece
              label={item}
              gradientColors={GRADIENT_PALETTE[index % GRADIENT_PALETTE.length]} // Cycles through the gradient palette
              onPress={() => handleCategoryPress(item)}
              index={index}
            />
          )}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  title: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  flatListWrapper: {
    overflow: "hidden",
  },
  flatListContainer: {
    paddingHorizontal: 10,
  },
  puzzleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    width: 150,
    height: 150,
  },
  puzzleLabel: {
    position: "absolute",
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    top: "40%",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

// import React, { useState, useRef, useCallback } from "react";
// import { View, Text, FlatList, Pressable, StyleSheet, ImageBackground } from "react-native";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { useLoginContext } from "./context/LoginContext";
// import config from "./config";

// const { API_URL } = config;

// export default function CategoryList() {
//   const navigation = useNavigation();
//   const loginContext = useLoginContext();
//   const [categories, setCategories] = useState<string[]>([]);
//   const flatListRef = useRef<FlatList>(null);

//   const fetchCategories = async () => {
//     try {
//       const response = await fetch(`${API_URL}/travel/memory/categories`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${loginContext.accessToken}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         console.log("category list data ", data);
//         setCategories(data);
//       } else {
//         console.error("Error fetching categories:", response.statusText);
//         // navigation.navigate("login");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchCategories();
//     }, [loginContext.accessToken]),
//   );

//   const handleCategoryPress = (category: string) => {
//     navigation.navigate("categoryMemPage", { category });
//   };

//   const CategoryButton: React.FC<{ label: string }> = ({ label }) => (
//     <Pressable style={styles.categoryButton} onPress={() => handleCategoryPress(label)}>
//       <ImageBackground
//         source={require("../assets/images/login-bg.jpg")}
//         style={styles.background}
//         imageStyle={{ resizeMode: "cover" }}
//       >
//         <Text style={styles.categoryButtonText}>{label}</Text>
//       </ImageBackground>
//     </Pressable>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>LISTS</Text>
//       <FlatList
//         ref={flatListRef}
//         // data={["All", ...categories]}
//         data={["All", ...categories.filter((category) => category !== "")]} 
//         renderItem={({ item }) => <CategoryButton label={item} />}
//         keyExtractor={(item) => item}
//         horizontal
//         showsHorizontalScrollIndicator={true}
//         style={styles.flatList}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 30,
//   },
//   title: {
//     color: "black",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 16,
//     textAlign: "center",
//   },
//   flatList: {
//     maxWidth: "80%",
//     flexGrow: 0,
//   },
//   categoryButton: {
//     width: 150,
//     height: 200,
//     borderRadius: 10,
//     marginHorizontal: 10,
//     overflow: "hidden",
//   },
//   background: {
//     height: "100%",
//     width: "100%",
//   },
//   categoryButtonText: {
//     color: "black",
//     fontWeight: "bold",
//     top: 10,
//     alignSelf: "center",
//   },
// });

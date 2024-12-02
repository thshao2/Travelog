import React, { useState, useContext } from "react";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { Box, Typography, Card, Grid } from "@mui/joy";
import { LoginContext } from "./context/LoginContext";
import config from "./config";
const { API_URL } = config;

interface CategoryButtonProps {
  label: string;
  index: number;
}

export default function SavedPage() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loginContext = useContext(LoginContext);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/travel/memory/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginContext.accessToken}`,
        },
      });
      if (response.ok) {
        const data: string[] = await response.json();
        const filteredCategories = data.filter((category) => category.trim() !== "");
        setCategories(filteredCategories);
      } else {
        console.error("Error fetching categories:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginContext.accessToken]),
  );

  const themeColors = ["#E29398", "#EFAA96", "#FBD6A1", "#99E2D0", "#86D0E8", "#9BB1F1", "#B590E0"];

  const CategoryButton: React.FC<CategoryButtonProps> = ({ label, index }) => (
    <Card
      onClick={() => handleCategoryPress(label)}
      sx={{
        width: "90%",
        height: "8em",
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "8px 0",
        backgroundColor: themeColors[index % themeColors.length],
        color: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
      }}
    >
      <Typography level="h4" sx={{ color: "white" }}>
        {label}
      </Typography>
    </Card>
  );

  return (
    <ScrollView>
      <Box sx={{ padding: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <ActivityIndicator size="large" />
          </Box>
        ) : categories.length > 0 ? (
          <>
            <Typography level="h3" sx={{ textAlign: "center", mb: 2 }}>
              View by Categories
            </Typography>
            <Grid container spacing={3}>
              {categories.map((category, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={category}>
                  <CategoryButton label={category} index={index} />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              textAlign: "center",
            }}
          >
            <Typography level="h4" sx={{ mb: 2 }}>
              Start categorizing your journey!
            </Typography>
            <Pressable onPress={() => navigation.navigate("map")}>
              <Typography
                level="h4"
                sx={{ color: "blue", textDecoration: "underline" }}
              >
                Go to Map
              </Typography>
            </Pressable>
          </Box>
        )}
      </Box>
    </ScrollView>
  );
}

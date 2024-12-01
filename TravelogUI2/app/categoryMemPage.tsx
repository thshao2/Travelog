import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Grid, Typography } from "@mui/joy";
import { useLoginContext } from "./context/LoginContext";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Journal } from "./popupMenu";
import { RootStackParamList } from "./types";
import config from "./config";
import Slider from "react-slick";
import { Box } from "@mui/material";

import MemoryCard from "./memoryCard";

const { API_URL } = config;

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
};

export default function CategoryMemPage() {
  const route = useRoute<RouteProp<RootStackParamList, "categoryMemPage">>();
  const { category } = route.params;
  const loginContext = useLoginContext();
  const [memories, setMemories] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitedStats, setVisitedStats] = useState({ count: 0, percentage: 0 });
  const [images, setImages] = useState([]);

  const fetchMemoriesByCategory = async () => {
    console.log("fetching mem");
    try {
      const response = await fetch(`${API_URL}/travel/memory/category/${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMemories(data);
        calculateVisitedStats(data);
      } else {
        console.error("Error fetching mem:", response.statusText);
      }

    } catch (err) {
      setError("Error fetching memories.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOverviewUrls = async () => {
    try {
      // get slideshow urls:
      const url_response = await fetch(`${API_URL}/travel/memory/category-overview/${category}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${loginContext.accessToken}`,
        },
      });
      if (!url_response.ok) {
        throw new Error("Network response was not ok");
      }
      const url_data = await url_response.json();
      setImages(url_data);

    } catch (err) {
      setError("Error fetching slideshow urls.");
      console.error(err);
    }
  };

  const calculateVisitedStats = (memories: Journal[]) => {
    const visited = memories.filter((memory) => memory.condition === "Visited").length;
    const total = memories.length;
    const percentage = total > 0 ? Math.round((visited / total) * 100) : 0;
    setVisitedStats({ count: visited, percentage });
  };

  useEffect(() => {
    fetchMemoriesByCategory();
    fetchOverviewUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginContext.accessToken, category]);

  useFocusEffect(
    useCallback(() => {
      fetchMemoriesByCategory();
      fetchOverviewUrls();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginContext.accessToken, category]),
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  const handleRefetch = () => {
    fetchMemoriesByCategory();
    fetchOverviewUrls();
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
    }}>
      {/* left side: journal grid */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 2, padding: 10 }} showsVerticalScrollIndicator={false}>
        <Typography level="h3" sx={{
          alignSelf: "center",
          fontWeight: "bold",
          paddingTop: 2,
        }}>{category}</Typography>
        <Typography level="h4" sx={{
          alignSelf: "center",
        }}>Visited: {visitedStats.count}/{memories.length} places ({visitedStats.percentage}%)</Typography>

        <Typography>{memories.length}</Typography>
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {memories.map((journal) => (
            <Grid
              key={journal.id}
              xs={12} sm={6} md={4}
            >
              <MemoryCard onRefetch={handleRefetch} journal={journal} />
            </Grid>
          ))}
        </Grid>
      </ScrollView>

      {/* right side: category overview */}
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#d9d9d9",
          width: "33%",
          height: "80%",
          overflow: "hidden",
          flexDirection: "column",
          margin: "2%",
          textAlign: "center",
        }}
      >
        {images.length === 0 ? (
          <Typography level="h4">Add images to your journals!</Typography>
        ) : (
          <Slider {...sliderSettings} dots={false}
            // style={{
            //   width: "100%", minHeight: "500px", justifyContent: "center", alignItems: "center"
            // }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Slide ${index + 1}`}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "500px",
                  width: "100%",
                  objectFit: "contain", // no vertical stretch for horizontal imgs
                }}
              />
            ))}
          </Slider>
        )}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16,
  },
});

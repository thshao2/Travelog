import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import CategoryList from "../categoryList";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeScreen() {
  const images = [
    "https://images8.alphacoders.com/103/1039011.jpg",
    "https://wallpapers.com/images/featured/vegas-4k-9gsywswzyt0y5l6f.jpg",
    "https://wallpapercave.com/wp/wp3948175.jpg",
    "https://engineering.ucsc.edu/files/2022/09/engineering2building-1024x576.jpg",
    "https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1283_print.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "60vh", // Carousel takes up 50% of the screen height
          // backgroundColor: "white", // Optional: fallback background color
          position: "relative", // Needed for aspect ratio handling
        }}
      >

        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            // <AspectRatio
            //   ratio="1200/500" // Use your desired ratio
            //   key={index}
            //   sx={{
            //     maxHeight: "60vh", // Limit height for responsiveness
            //     width: "100%",
            //     height: "100%",
            //     minWidth: "100vh",
            //     // overflow: "hidden", // Ensures no stretching
            //   }}
            // >
            <Box
              key={index}
              component="img"
              src={image}
              alt={`Slide ${index + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                maxHeight: "60vh",
                objectFit: "cover", // Ensures the full image fits in the container
              }}
            />
            // </AspectRatio>
          ))}
        </Slider>
      </Box>
      <CategoryList />
    </>
  );
}

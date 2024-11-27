import React from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import { useNavigation } from "@react-navigation/native";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLoginContext } from "./context/LoginContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const loginContext = useLoginContext();

  const images = [
    "https://images8.alphacoders.com/103/1039011.jpg",
    "https://wallpapers.com/images/featured/vegas-4k-9gsywswzyt0y5l6f.jpg",
    "https://wallpapercave.com/wp/wp3948175.jpg",
    "https://engineering.ucsc.edu/files/2022/09/engineering2building-1024x576.jpg",
    // "https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1283_print.jpg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const lets_go_func = () => {
    if (loginContext.accessToken) {
      navigation.navigate("map");
    } else {
      navigation.navigate("login");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Slideshow */}
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                // height: { xs: "300px", sm: "400px", md: "100%" },
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={image}
                alt={`Slide ${index + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Black Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                }}
              />

              {/* Inspiring Text */}
              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  width: "90%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  color: "white",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    fontSize: { xs: "1.5rem", sm: "2.5rem", md: "3rem" },
                  }}
                >
                  Capture Memories, Explore the World!
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    maxWidth: "700px",
                    mx: "auto",
                    mb: 4,
                    fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.3rem" },
                  }}
                >
                  Life is about the adventures you take and the memories you make.
                </Typography>
                <Typography
                  onClick={()=>lets_go_func()}
                  variant="h5"
                  sx={{
                    color: "#FCC7B5",
                    px: 4,
                    py: 2,
                    fontWeight: "bold",
                    display: "inline-block",
                    fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" },
                    cursor: "pointer",
                  }}
                >
                  Let’s Go...
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

// import React from "react";
// import Slider from "react-slick";
// import { Box, Typography, AppBar, Toolbar } from "@mui/material";
// import {ActivityIndicator, ScrollView } from "react-native";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function HomeScreen() {
//   const images = [
//     "https://images8.alphacoders.com/103/1039011.jpg",
//     "https://wallpapers.com/images/featured/vegas-4k-9gsywswzyt0y5l6f.jpg",
//     "https://wallpapercave.com/wp/wp3948175.jpg",
//     "https://engineering.ucsc.edu/files/2022/09/engineering2building-1024x576.jpg",
//     "https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1283_print.jpg",
//   ];

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//   };

//   return (
   
//     <Box
//       sx={{
//         width: "100%",
//         height: "100vh", // Full viewport height
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//  <ScrollView>
//       {/* Slideshow */}
//       <Box sx={{ flexGrow: 1, position: "relative" }}>
//         <Slider {...sliderSettings}>
//           {images.map((image, index) => (
//             <Box
//               key={index}
//               sx={{
//                 position: "relative",
//                 width: "100%",
//                 height: "100%",
//                 overflow: "hidden",
//               }}
//             >
//               {/* Image */}
//               <Box
//                 component="img"
//                 src={image}
//                 alt={`Slide ${index + 1}`}
//                 sx={{
//                   width: "100%",
//                   height: "100%",
//                   objectFit: "cover",
//                 }}
//               />

//               {/* Black Overlay */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: "100%",
//                   height: "100%",
//                   backgroundColor: "rgba(0, 0, 0, 0.5)",
//                 }}
//               />

//               {/* Inspiring Text */}
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: "40%",
//                   left: "50%",
//                   width: "70%",
//                   transform: "translate(-50%, -50%)",
//                   textAlign: "center",
//                   color: "white",
//                 }}
//               >
//                 <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
//                   Capture Memories, Explore the World!
//                 </Typography>
//                 <Typography
//                   variant="h6"
//                   sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
//                 >
//                   Life is about the adventures you take and the memories you make.
//                 </Typography>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#FCC7B5",
//                     px: 4,
//                     py: 2,
//                     fontWeight: "bold",
//                     display: "inline-block",
//                   }}
//                 >
//                   Let’s Go...
//                 </Typography>
//               </Box>
//             </Box>
//           ))}
//         </Slider>
//       </Box>    </ScrollView>
//     </Box>

//   );
// }

// import React from "react";
// import Slider from "react-slick";
// import { Box, Typography } from "@mui/material";
// import { ScrollView } from "react-native";
// import CategoryList from "./categoryList";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function HomeScreen() {
//   const images = [
//     "https://images8.alphacoders.com/103/1039011.jpg",
//     "https://wallpapers.com/images/featured/vegas-4k-9gsywswzyt0y5l6f.jpg",
//     "https://wallpapercave.com/wp/wp3948175.jpg",
//     "https://engineering.ucsc.edu/files/2022/09/engineering2building-1024x576.jpg",
//     "https://api.coarchitects.com/wp-content/uploads/2022/08/COJ124_N1283_print.jpg",
//   ];

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//   };

//   return (
//     <>
//       <ScrollView>
//         <Box
//           sx={{
//             width: "100%",
//             height: "100%", // Carousel takes up 70% of the screen height
//             position: "relative", // Ensures overlay and text positioning
//           }}
//         >
//           <Slider {...sliderSettings}>
//             {images.map((image, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   position: "relative",
//                   width: "100%",
//                   // height: "100%",
//                   // maxHeight: "100%",
//                   overflow: "hidden",
//                 }}
//               >
//                 {/* Image */}
//                 <Box
//                   component="img"
//                   src={image}
//                   alt={`Slide ${index + 1}`}
//                   sx={{
//                     width: "100%",
//                     height: "100%",
//                     objectFit: "cover",
//                   }}
//                 />

//                 {/* Black Overlay */}
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundColor: "rgba(0, 0, 0, 0.5)",
//                   }}
//                 />

//                 {/* Inspiring Text */}
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     width: "70%",
//                     transform: "translate(-50%, -50%)",
//                     textAlign: "center",
//                     color: "white",
//                   }}
//                 >
//                   <Typography
//                     variant="h3"
//                     sx={{ fontWeight: "bold", mb: 2 }}
//                   >
//                     Capture Memories, Explore the World!
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{ maxWidth: "600px", mx: "auto", mb: 4 }}
//                   >
//                     Life is about the adventures you take and the memories you make.
//                   </Typography>
//                   <Typography
//                     variant="h5"
//                     sx={{
//                       color: "#FCC7B5",
//                       px: 4,
//                       py: 2,
//                       fontWeight: "bold",
//                       display: "inline-block",
//                     }}
//                   >
//                     Let’s Go...
//                   </Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Slider>
//         </Box>
//         {/* <CategoryList /> */}
//       </ScrollView>
//     </>
//   );
// }

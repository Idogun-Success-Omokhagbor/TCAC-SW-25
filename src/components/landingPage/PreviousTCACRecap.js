import { Box, Flex, Heading,  Image, Text, VStack } from "@chakra-ui/react";
import Slider from "react-slick";

// Sample data for updates
const updates = [
  {
    id: 1,
    image: "/images/prev1.png",
    title: "Wind Turbine 1",
    description: "The first wind turbine update."
  },
  {
    id: 2,
    image: "/images/prev2.png",
    title: "Wind Turbine 2",
    description: "The second wind turbine update."
  },
  {
    id: 3,
    image: "/images/prev1.png",
    title: "Forest Road",
    description: "A road through the forest."
  },
  {
    id: 4,
    image: "/images/prev2.png",
    title: "Wind Turbine 3",
    description: "The third wind turbine update."
  },
  {
    id: 5,
    image: "/images/prev1.png",
    title: "Wind Turbine 4",
    description: "The fourth wind turbine update."
  },
  {
    id: 6,
    image: "/images/prev2.png",
    title: "Wind Turbine 5",
    description: "The fifth wind turbine update."
  }
];

const PrevTCACRecap = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    fade: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box bg="green.500" py={6} px={4}>
       <Flex
        justifyItems={"flex-start"}
        alignItems={"center"}
         maxW="fit-content"
         mb={6}
        p={"2"}
        border="2px solid black"
        boxShadow="4px 4px 12px rgba(0, 0, 0, 0.8)"
        className="bg-lime-100"
      >
        <Heading as="h2" textAlign="center">
         Previous TCAC Recap
        </Heading>
      </Flex>

      <Slider {...settings}>
        {updates.map((update) => (
          <Box key={update.id} px={2}>
            <VStack spacing={2} align="start">
              <Image
                src={update.image}
                alt={update.title}
                // boxSize="200px"
                objectFit="cover"
                borderRadius="md"
              />
              <Text fontWeight="bold" color="white" fontSize="lg">
                {update.title}
              </Text>
              <Text color="white" fontSize="sm">
                {update.description}
              </Text>
            </VStack>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PrevTCACRecap;





// import { Box, Flex, Heading, Image, HStack } from "@chakra-ui/react";
// import { motion } from "framer-motion";
// import { useState, useEffect } from "react";

// const PreviousTCAC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const images = [
//     "/images/prev1.png",
//     "/images/prev2.png",
//     "/images/prev1.png",
//     "/images/prev2.png",
//     "/images/prev1.png",
//   ];

//   const imagesPerSlide = 3; // Display 3 images at a time
//   const slideDuration = 3000; // Stay for 3 seconds

//   // Automatically slide every 3 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(
//         (prevIndex) => (prevIndex + imagesPerSlide) % images.length
//       );
//     }, slideDuration);

//     return () => clearInterval(interval); // Clear interval on unmount
//   }, [images.length]);

//   // Calculate which images to display for the current slide
//   const displayedImages = images.slice(
//     currentIndex,
//     currentIndex + imagesPerSlide
//   );

//   return (
//     <Box
//       as="section"
//       display={"flex"}
//       flexDirection={"column"}
//       gap={"4"}
//       bg="green.500"
//       py={8}
//       px={8}
//     >
//       <Flex
//         justifyItems={"flex-start"}
//         alignItems={"center"}
//         maxW={"sm"}
//         p={"2"}
//         border="2px solid black"
//         boxShadow="4px 4px 12px rgba(0, 0, 0, 0.8)"
//         className="bg-lime-100"
//       >
//         <Heading as="h2" textAlign="center">
//           Previous TCAC
//         </Heading>
//       </Flex>

//       <Box overflow="hidden" className="relative">
//         <HStack
//           as={motion.div}
//           className="image-slider"
//           spacing={4}
//           justifyContent="center" // Center images
//           initial={{ x: 0 }}
//           animate={{ x: "-100%" }} // Slide out to the left
//           transition={{
//             x: {
//               type: "tween",
//               duration: 1, // Slide-out duration (smooth transition)
//               ease: "easeInOut",
//               delay: 2, // Stay for 2 seconds before sliding
//             },
//             repeat: Infinity, // Repeat indefinitely
//             repeatType: "loop",
//           }}
//         >
//           {displayedImages.map((src, index) => (
//             <Image
//               key={index}
//               src={src}
//               alt={`Recap Image ${index + 1}`}
//               boxSize="150px"
//               borderRadius="md"
//             />
//           ))}
//         </HStack>
//       </Box>
//     </Box>
//   );
// };

// export default PreviousTCAC;

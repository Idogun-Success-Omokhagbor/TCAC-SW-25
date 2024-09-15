import { Box, Flex, Text, Heading, Image } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";

// Sample updates data
const updates = [
  {
    imgSrc: "/images/image5.png",
    title: "TILETS",
    description: "TIMSAN Southwest TILETS is... ",
  },
  {
    imgSrc: "/images/image5.png",
    title: "Reading Club",
    description: "TIMSAN Southwest reading club is...",
  },
  {
    imgSrc: "/images/image5.png",
    title: "Congres",
    description: "TIMSAN Southwest congress is...",
  },
  // Add more objects as needed
];

const TCACUpdates = () => {
  // react-slick settings for the carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    fade: true,
  };

  return (
    <Box as="section"  py={12} px={8} id="tcac-updates" className="bg-[#DFFBA4]">
      {/* Section Header */}
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        mb={6}
        p={2}
        border="2px solid black"
        boxShadow="4px 4px 12px rgba(0, 0, 0, 0.8)"
        bg="green.500"
        maxW="fit-content"
      >
        <Heading as="h2" textAlign="center" fontSize="2xl">
          TCAC Updates
        </Heading>
      </Flex>

      {/* Slider Section */}
      <Slider {...settings}>
        {updates.map((update, index) => (
          <Box key={index} position="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={update.imgSrc}
                alt={update.title}
                borderRadius="md"
                objectFit="cover"
                w="full"
                h={{ base: "300px", md: "500px" }}
              />
              <Box
                position="absolute"
                bottom={8}
                left={8}
                right={8}
                p={4}
                bg="rgba(0, 0, 0, 0.3)"
                color="gray.50"
                borderRadius="md"
                textAlign="center"
                border="2px solid black"
                boxShadow="lg"
              >
                <Text fontSize="xl" fontWeight="bold" color="gray.50">
                  {update.title}
                </Text>
                <Text fontSize="md" mt={2} color="gray.50">
                  {update.description}
                </Text>
              </Box>
            </motion.div>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default TCACUpdates;

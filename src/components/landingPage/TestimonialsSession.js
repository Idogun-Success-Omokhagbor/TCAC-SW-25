// components/TestimonialsSection.js
import { Box, Heading, Text, Image, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  return (
    <Box as="section" bg="green.100" py={8} px={8} id="testimonials">
      <Heading as="h2" mb={6} textAlign="center">Testimonials</Heading>
      <Flex justify="center">
        <Box
          as={motion.div}
          bg="white"
          borderRadius="md"
          boxShadow="md"
          p={4}
          textAlign="center"
          maxW="600px"
          whileHover={{ scale: 1.05 }}
        >
          <Image src="/path/to/testimonial-image.png" alt="Testimonial" mb={4} />
          <Text fontSize="lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default TestimonialsSection;

// components/WelcomeMessage.js
import { Box, Text } from "@chakra-ui/react";

const WelcomeMessage = ({ name }) => {
  return (
    <Box textAlign="center" my={8}>
      <Text fontSize="2xl">
        Welcome back to TCAC&apos;24, <strong>{name}</strong>!
      </Text>
      <Text fontSize="md">We are family</Text>
    </Box>
  );
};

export default WelcomeMessage;

import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const UserDashboard = ({ accountData }) => {
  return (
    <Box bg="#e6efe3" minH="100vh" p={8}>
      <Heading size="2xl" mb={2}>
        Welcome back to TCAC ‘24,{" "}
        <Box as="span" fontWeight="bold">
          {accountData?.firstName || accountData?.userID}!
        </Box>
      </Heading>
      <Text fontSize="xl" mb={8}>
        We are not just a camp, we are family.
      </Text>
    </Box>
  );
};

export default UserDashboard;
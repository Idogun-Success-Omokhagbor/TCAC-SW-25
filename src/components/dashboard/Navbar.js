// components/Navbar.js
import { Box, Flex, IconButton, Text, Image } from "@chakra-ui/react";
import { FaBars, FaHome } from "react-icons/fa";

const Navbar = ({ onOpenSidebar }) => {
  return (
    <Box bg="green.50" px={4} py={2} shadow="md">
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <IconButton
            icon={<FaBars />}
            aria-label="Open Sidebar"
            onClick={onOpenSidebar}
            display={{ md: "none" }}
            mr={4}
          />
          <Image src="/path/to/logo.png" alt="Logo" boxSize="40px" />
          <Text fontSize="xl" ml={4}>
            Home
          </Text>
        </Flex>
        <Flex>
          <Text>Welcome, User</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;

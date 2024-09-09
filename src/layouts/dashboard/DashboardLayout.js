// components/DashboardLayout.js
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Sidebar from "../../components/dashboard/Sidebar.js";
import Navbar from "../../components/dashboard/Navbar.js";
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const DashboardLayout = ({role, children, onMenuClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  console.log(`Current Role: ${role}`);

  return (
    <Flex minH="100vh" bg="green.50">
      <Sidebar onMenuClick={onMenuClick} isOpen={isOpen} onClose={onClose} />
      <MotionBox
        as="main"
        flex="1"
        p="8"
        bg="green.100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Text>Welcome back to TCAC&apos;24</Text>
        <Navbar onOpenSidebar={onOpen} />
        <Box p={8}>{children}</Box>
      </MotionBox>
     
    </Flex>
  );
};

export default DashboardLayout;

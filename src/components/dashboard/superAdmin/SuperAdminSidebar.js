import React from 'react';
import { VStack, Text, Link, Flex } from '@chakra-ui/react';
import { FaHome, FaCogs, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const SuperAdminSidebar = ({ onMenuClick }) => {
  return (
    <VStack
      as="nav"
      align="start"
      w="250px"
      p="4"
      bg="red.200"
      color="gray.700"
      spacing={4}
      className="h-full"
    >
      <Text mb={8} textAlign="center" fontSize="xl">Welcome, Super Admin</Text>

      <Link onClick={() => onMenuClick('dashboard')}>
        <Flex align="center">
          <FaHome />
          <Text ml={2}>Dashboard</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('admin-management')}>
        <Flex align="center">
          <FaUsers />
          <Text ml={2}>Admin Management</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('system-settings')}>
        <Flex align="center">
          <FaCogs />
          <Text ml={2}>System Settings</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('logout')}>
        <Flex align="center">
          <FaSignOutAlt />
          <Text ml={2}>Logout</Text>
        </Flex>
      </Link>
    </VStack>
  );
};

export default SuperAdminSidebar;

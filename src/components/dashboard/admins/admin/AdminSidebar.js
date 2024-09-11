import React from 'react';
import { VStack, Text, Link, Flex } from '@chakra-ui/react';
import { FaHome, FaUserCog, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = ({ onMenuClick }) => {
  return (
    <VStack
      as="nav"
      align="start"
      w="250px"
      p="4"
      bg="purple.200"
      color="gray.700"
      spacing={4}
      className="h-full"
    >
      <Text mb={8} textAlign="center" fontSize="xl">Welcome, Admin</Text>

      <Link onClick={() => onMenuClick('dashboard')}>
        <Flex align="center">
          <FaHome />
          <Text ml={2}>Dashboard</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('user-management')}>
        <Flex align="center">
          <FaUsers />
          <Text ml={2}>User Management</Text>
        </Flex>
      </Link>

      <Link onClick={() => onMenuClick('admin-settings')}>
        <Flex align="center">
          <FaUserCog />
          <Text ml={2}>Settings</Text>
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

export default AdminSidebar;

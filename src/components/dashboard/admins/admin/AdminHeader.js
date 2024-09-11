import React, { useState } from 'react';
import { Box, IconButton, Flex, Text, VStack, Collapse, Link } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaUserCog, FaUsers } from 'react-icons/fa';

const AdminHeader = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box bg="purple.300" p={4} display={{ base: 'block', md: 'none' }} color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">Admin Panel</Text>
        <IconButton
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
        />
      </Flex>
      <Collapse in={isOpen}>
        <VStack mt={4} align="start" spacing={4}>
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
        </VStack>
      </Collapse>
    </Box>
  );
};

export default AdminHeader;

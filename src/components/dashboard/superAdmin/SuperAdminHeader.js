import React, { useState } from 'react';
import { Box, IconButton, Flex, Text, VStack, Collapse, Link } from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaCogs, FaUsers } from 'react-icons/fa';

const SuperAdminHeader = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <Box bg="red.300" p={4} display={{ base: 'block', md: 'none' }} color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">Super Admin Panel</Text>
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
        </VStack>
      </Collapse>
    </Box>
  );
};

export default SuperAdminHeader;

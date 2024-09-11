import React, { useState } from 'react';
import { Box, VStack, Text, Link, IconButton, Collapse } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaUser, FaEnvelope, FaHome } from 'react-icons/fa';

const UserSidebar = ({ onMenuClick }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  return (
    <VStack
      as="nav"
      align="start"
      w="250px"
      p="4"
      bg="green.200"
      color="gray-700"
      spacing={4}
      borderRadius="md"
    >
      <Text mb={8} textAlign="center" fontSize="xl">
        Welcome back, <br /> <strong>TCAC&apos;24</strong>
      </Text>

      <Box className="hover:scale-105" onClick={() => onMenuClick('dashboard')}>
        <Link display="flex" alignItems="center">
          <FaHome />
          <Text ml="2">Dashboard</Text>
        </Link>
      </Box>

      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className="hover:scale-105"
          onClick={() => toggleSubMenu('livechat')}
        >
          <Link display="flex" alignItems="center">
            <FaEnvelope />
            <Text ml="2">Chat with us</Text>
          </Link>
          <IconButton
            icon={activeSubMenu === 'livechat' ? <ChevronDownIcon /> : <ChevronRightIcon />}
            size="xs"
            variant="ghost"
            aria-label="Toggle Submenu"
          />
        </Box>
        <Collapse in={activeSubMenu === 'livechat'}>
          <VStack align="start" pl="6" mt="2">
            {['TCAC Convocation', 'Protocol Team', 'Medical Team', 'Welfare Team', 'Registration Team', 'Kitchen'].map((subMenu, index) => (
              <Box key={index} className="hover:scale-105" onClick={() => onMenuClick(subMenu.toLowerCase().replace(' ', '-'))}>
                <Link>{subMenu}</Link>
              </Box>
            ))}
          </VStack>
        </Collapse>
      </Box>

      <Box className="hover:scale-105" onClick={() => onMenuClick('logout')}>
        <Link display="flex" alignItems="center">
          <FaUser />
          <Text ml="2">Logout</Text>
        </Link>
      </Box>
    </VStack>
  );
};

export default UserSidebar;

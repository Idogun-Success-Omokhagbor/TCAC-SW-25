import React, { useState } from 'react';
import { Box, VStack, Text, Link, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaHome } from 'react-icons/fa';

const MotionBox = motion(Box);

const Sidebar = ({ onMenuClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
    setIsOpen(!isOpen);
  };

  return (
    <VStack
      as="nav"
      align="start"
      w="250px"
      p="4"
      bg="green.200"
      color="gray.700"
      spacing={4}
      borderRadius="md"
    >

<Text mb={8} textAlign="center" fontSize="xl">
          Welcome back, <br /> <strong>TCAC&apos;24</strong>
        </Text>
        
      <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('dashboard')}>
        <Link>
          <FaHome />
          <Text ml="2">Dashboard</Text>
        </Link>
      </MotionBox>

      <Box>
        <MotionBox
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          whileHover={{ scale: 1.05 }}
          onClick={() => toggleSubMenu('livechat')}
        >
          <Link>
            <FaEnvelope />
            <Text ml="2">Chat with us</Text>
          </Link>
          <IconButton
            icon={isOpen && activeSubMenu === 'livechat' ? <ChevronDownIcon /> : <ChevronRightIcon />}
            size="xs"
            variant="ghost"
            aria-label="Toggle Submenu"
            onClick={() => toggleSubMenu('livechat')}
          />
        </MotionBox>
        {isOpen && activeSubMenu === 'livechat' && (
          <VStack align="start" pl="6" mt="2">
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('tcac-convocation')}>
              <Link>TCAC Convocation</Link>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('protocol-team')}>
              <Link>Protocol Team</Link>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('medical-team')}>
              <Link>Medical Team</Link>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('welfare-team')}>
              <Link>Welfare Team</Link>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('registration-team')}>
              <Link>Registration Team</Link>
            </MotionBox>
            <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('kitchen')}>
              <Link>Kitchen</Link>
            </MotionBox>
          </VStack>
        )}
      </Box>

      <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('logout')}>
        <Link>
          <FaUser />
          <Text ml="2">Logout</Text>
        </Link>
      </MotionBox>
    </VStack>
  );
};

export default Sidebar;

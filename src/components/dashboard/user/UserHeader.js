// components/dashboard/UserHeader.js
import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  VStack,
  HStack,
  Link,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const UserHeader = ({ onMenuClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (menu) => {
    setActiveSubMenu(activeSubMenu === menu ? null : menu);
  };

  return (
    <>
      <Flex
        as="header"
        bg="green.200"
        p={4}
        justify="space-between"
        align="center"
        display={{ base: 'flex', md: 'none' }} // Only show on mobile and small screens
      >
        <Text fontSize="xl" fontWeight="bold">
          TCAC&apos;24
        </Text>
        <IconButton
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          colorScheme="gray"
          onClick={isOpen ? onClose : onOpen}
          aria-label="Toggle Navigation"
        />
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="green.200">
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>

          <DrawerBody>
            <VStack as="nav" align="start" spacing={4}>
              <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('dashboard')}>
                <Link onClick={onClose} display="flex" alignItems="center">
                  <FaHome />
                  <Text ml="2">Dashboard</Text>
                </Link>
              </MotionBox>

              <Box w="full">
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
                    icon={activeSubMenu === 'livechat' ? <CloseIcon /> : <HamburgerIcon />}
                    size="xs"
                    variant="ghost"
                    aria-label="Toggle Submenu"
                  />
                </MotionBox>
                {activeSubMenu === 'livechat' && (
                  <VStack align="start" pl="6" mt="2">
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('tcac-convocation')}>
                      <Link onClick={onClose}>TCAC Convocation</Link>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('protocol-team')}>
                      <Link onClick={onClose}>Protocol Team</Link>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('medical-team')}>
                      <Link onClick={onClose}>Medical Team</Link>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('welfare-team')}>
                      <Link onClick={onClose}>Welfare Team</Link>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('registration-team')}>
                      <Link onClick={onClose}>Registration Team</Link>
                    </MotionBox>
                    <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('kitchen')}>
                      <Link onClick={onClose}>Kitchen</Link>
                    </MotionBox>
                  </VStack>
                )}
              </Box>

              <MotionBox whileHover={{ scale: 1.05 }} onClick={() => onMenuClick('logout')}>
                <Link onClick={onClose} display="flex" alignItems="center">
                  <FaUser />
                  <Text ml="2">Logout</Text>
                </Link>
              </MotionBox>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UserHeader;

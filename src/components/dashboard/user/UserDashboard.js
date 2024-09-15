import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router"; // Assuming you are using Next.js for routing

const UserDashboard = ({ accountData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  React.useEffect(() => {
    // Open the modal when the component mounts
    onOpen();
  }, [onOpen]);

  const handleGoHome = () => {
    router.push("/"); // Navigate to the home page
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={4}
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="md"
    >
      {/* Modal for welcome message and notification */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcome to Your Dashboard</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="lg">
              Hello, {accountData.userID}! The dashboard is not available yet.
              Please check back later.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleGoHome}>
              Go Home
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserDashboard;






// import React from "react";
// import { Box, Select, Text } from "@chakra-ui/react";
// import MealSchedule from "../MealSchedule";
// import DailySchedule from "../DailySchedule";

// const UserDashboard = ({accountData}) => {
//   return (
//     <Box display={"flex"} flexDirection={"column"} gap={4} p={4} bg="white"  borderRadius="md" boxShadow="md">
//       <MealSchedule />
//       <DailySchedule />
//     </Box>
//   );
// };

// export default UserDashboard;

import {
  Box,
  Flex,
  Button,
  Image,
  IconButton,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FaBell } from "react-icons/fa";
import BankDetailsModal from "./BankDetailsModal";
import NewsModal from "./NewsModal";

// Define the news array here
const newsArray = [
  {
    id: 1,
    title: "Important Update",
    description: "Update regarding our upcoming events and changes.",
    date: "2024-09-01",
  },
  {
    id: 2,
    title: "New Initiatives",
    description: "Introducing new initiatives and programs for the community.",
    date: "2024-08-25",
  },
  {
    id: 3,
    title: "Annual Report",
    description: "A detailed report of our achievements over the past year.",
    date: "2024-08-10",
  },
];

const Header = () => {
  const router = useRouter();
  const {
    isOpen: isBankModalOpen,
    onOpen: onOpenBankModal,
    onClose: onCloseBankModal,
  } = useDisclosure();
  const {
    isOpen: isNewsModalOpen,
    onOpen: onOpenNewsModal,
    onClose: onCloseNewsModal,
  } = useDisclosure();

  return (
    <Box as="header" bg="green.50" p={4}>
      <Flex justify="space-between" align="center">
        <Image src="/timsan-logo.png" alt="Logo" boxSize="60px" />
        <Flex align="center" gap={8}>
          {/* <Button colorScheme="gray.500" variant="link" onClick={() => router.push(`/login/user`)}>
            Home
          </Button> */}

          {/* notification/news */}
          <Flex align="center" position="relative">
            <IconButton
              aria-label="News"
              icon={<FaBell />}
              size="lg"
              isRound
              colorScheme="gray"
              onClick={onOpenNewsModal}
            />
            {newsArray.length > 0 && (
              <Badge
                position="absolute"
                top={-1}
                right={-1}
                colorScheme="red"
                variant="solid"
                fontSize="0.8em"
                borderRadius="full"
                px={2}
                py={1}
                minWidth="24px"
                textAlign="center"
              >
                {newsArray.length}
              </Badge>
            )}
          </Flex>

          {/* <Button
            colorScheme="gray.500"
            variant="link"
            onClick={onOpenBankModal}
          >
            Donate
          </Button> */}
          {/* login */}
          <Button
            colorScheme="green.500"
            variant="solid"
            px={6}
             borderRadius="xl"
            border={"1px solid #000000"}
            boxShadow={"2px 2px 0px 0px #000000"}
            onClick={() => router.push("/login/user")}
          >
            Login
          </Button>

          {/* <Button
            colorScheme="green.500"
            variant="solid"
            px={6}
            boxShadow={"2px 2px 0px 0px #000000"}
            rounded="2xl"
            border={"2px solid #000000"}
            onClick={() => router.push("/register/user")}
          >
            Register
          </Button> */}
        </Flex>
      </Flex>

      {/* Modals */}
      <BankDetailsModal isOpen={isBankModalOpen} onClose={onCloseBankModal} />
      <NewsModal
        isOpen={isNewsModalOpen}
        onClose={onCloseNewsModal}
        newsArray={newsArray}
      />
    </Box>
  );
};

export default Header;

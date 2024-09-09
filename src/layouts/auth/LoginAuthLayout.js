// components/LoginLayout.js
import Link from "next/link";
import { Box, Flex, Stack, HStack, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

const LoginAuthLayout = ({ formHeading, loginForm, role }) => {
  const router = useRouter();

  return (
    <Box>
      {/* header */}
      <Flex
        justify="space-between"
        alignItems={"center"}
        mb={2}
        borderBottom="2px solid"
        borderColor="gray.100"
        zIndex="10"
        py={8}
        px={12}
      >
        <Text as="a" href="/" fontWeight="bold">
          Home
        </Text>

        <HStack spacing={4}>
          <Text fontWeight="medium">Don&apos;t have an account yet?</Text>
          <Button
            variant="outline"
            colorScheme="green"
            p={4}
            borderRadius="xl"
            border="1px solid black"
            boxShadow={"2px 2px 0px 0px #000000"}
            color={"black"}
            _hover={{
              color: "white",
              bg: "green.500",
              borderColor: "green.500",
            }}
            onClick={() => router.push(`/register/${role}`)}
          >
            Register
          </Button>
        </HStack>
      </Flex>

      <Flex minH="100vh" justify="center" align="center" bg="green.50">
        <Box
          w={{ base: "90%", md: "400px" }}
          p={8}
          boxShadow="lg"
          borderRadius="lg"
          bg="green.100"
          color="green.900"
        >
          {/* Login form component */}
          {loginForm}

          <Stack spacing={4} mt={6}>
            <Text fontSize="sm" color="gray.600">
              Don&apos;t have an account yet?{" "}
              <Link href={`/register/${role}`} passHref>
                <Button
                  variant="link"
                  colorScheme="green"
                  _hover={{
                    color: "white",
                    bg: "green.500",
                    borderColor: "green.500",
                    px: "2",
                    py: "1",
                  }}
                >
                  Register
                </Button>
              </Link>
            </Text>
            <Text fontSize="sm" color="gray.600">
              Forgot password?{" "}
              <Link href={`/reset-password/${role}`} passHref>
                <Button
                  variant="link"
                  colorScheme="green"
                  _hover={{
                    color: "white",
                    bg: "green.500",
                    borderColor: "green.500",
                    px: "2",
                    py: "1",
                  }}
                >
                  Reset
                </Button>
              </Link>
            </Text>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
};

export default LoginAuthLayout;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  registerAdmin,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";

const AdminRegistrationForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: "Success!",
        description: "Registration successful. Redirecting to login...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/login/${role}`);
    } else if (status === "failed") {
      toast({
        title: "Error!",
        description: error?.message || "An error occurred during registration.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validateForm = () => {
    const errors = {};
    const { firstName, lastName, email, phoneNumber } = formValues;

    if (!firstName) {
      errors.firstName = "First name is required";
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const values = { ...formValues, role: role === "admin" ? "Admin" : role };
      const resultAction = await dispatch(registerAdmin(values));
      if (registerAdmin.fulfilled.match(resultAction)) {
        // Redirect to login page after successful registration
        router.push(`/login/${role}`);
      } else {
        console.log("Error: ", resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isInvalid={formErrors.firstName}>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          type="text"
          value={formValues.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.firstName}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.lastName}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          type="text"
          value={formValues.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.lastName}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.email}>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.phoneNumber}>
        <FormLabel>
          Phone Number <Box as="span" fontSize="sm" color="gray.500">(WhatsApp enabled)</Box>
        </FormLabel>
        <Input
          name="phoneNumber"
          type="tel"
          value={formValues.phoneNumber}
          onChange={handleChange}
          placeholder="Enter your phone number"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.phoneNumber}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
        isLoading={loading}
        colorScheme="green"
      >
        Register
      </Button>
    </form>
  );
};

export default AdminRegistrationForm;

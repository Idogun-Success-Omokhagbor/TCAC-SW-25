import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  registerSuperAdmin,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

const SuperAdminRegistrationForm = ({ role }) => {
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
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

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
      errors.firstName = "Required";
    }
    if (!lastName) {
      errors.lastName = "Required";
    }
    if (!email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!phoneNumber) {
      errors.phoneNumber = "Required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Ensure the role is "Super Admin" if the role passed is "super_admin"
    if (role === "super_admin") {
      formValues.role = "Super Admin";
    }

    try {
      const resultAction = await dispatch(registerSuperAdmin(formValues));
      if (registerSuperAdmin.fulfilled.match(resultAction)) {
        // Successful registration
        setFormValues({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
        }); // Clear form values
      } else {
        // Handle error from Redux
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
    setTouched({ ...touched, [name]: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isInvalid={formErrors.firstName && touched.firstName}>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          type="text"
          value={formValues.firstName}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, firstName: true })}
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

      <FormControl mb={4} isInvalid={formErrors.lastName && touched.lastName}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          type="text"
          value={formValues.lastName}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, lastName: true })}
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

      <FormControl mb={4} isInvalid={formErrors.email && touched.email}>
        <FormLabel>Email Address</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, email: true })}
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

      <FormControl mb={4} isInvalid={formErrors.phoneNumber && touched.phoneNumber}>
        <FormLabel>
          Phone Number <Box as="span" fontSize="sm" color="gray.500">(WhatsApp enabled)</Box>
        </FormLabel>
        <Input
          name="phoneNumber"
          type="tel"
          value={formValues.phoneNumber}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, phoneNumber: true })}
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
        colorScheme="blue"
        mt={4}
      >
        Register
      </Button>
    </form>
  );
};

export default SuperAdminRegistrationForm;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginAdmin,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  useToast,
  Box,
} from "@chakra-ui/react";

const AdminLoginForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: "Success!",
        description: "Login successful. Redirecting to your dashboard...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/dashboard/${role}`);
    } else if (status === "failed") {
      toast({
        title: "Error!",
        description: error?.message || "Login failed. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validateForm = () => {
    const errors = {};
    const { email, password } = formValues;

    if (!email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!password) {
      errors.password = "Required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(loginAdmin({ ...formValues, role }));
      if (loginAdmin.fulfilled.match(resultAction)) {
        const adminData = resultAction.payload;
        if (adminData.registrationStatus === "pending") {
          toast({
            title: "Pending Approval",
            description: "Your account is pending approval. Please check back later.",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        } else if (adminData.registrationStatus === "rejected") {
          toast({
            title: "Registration Rejected",
            description: "Your account has been rejected. Please contact support or re-register.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } else {
          // Successful login already handled in useEffect
        }
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
      <FormControl mb={4} isInvalid={formErrors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter your email"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.password}>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Enter your password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
        isLoading={loading}
        colorScheme="blue"
      >
        Login
      </Button>
    </form>
  );
};

export default AdminLoginForm;

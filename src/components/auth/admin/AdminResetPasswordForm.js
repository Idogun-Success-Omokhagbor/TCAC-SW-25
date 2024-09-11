import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAdminPassword,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const AdminResetPasswordForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const { role = "user" } = router.query;

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      toast({
        title: "Success!",
        description: "Password reset successful. Redirecting to login...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/login/${role}`);
    } else if (status === "failed") {
      toast({
        title: "Error!",
        description: error?.message || "An error occurred during password reset.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validateForm = () => {
    const errors = {};
    const { email, password, confirmPassword } = formValues;

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords must match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(resetAdminPassword(formValues));
      if (resetAdminPassword.fulfilled.match(resultAction)) {
        // Successful reset
        setFormValues({
          email: "",
          password: "",
          confirmPassword: "",
        });
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
        <FormLabel>New Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Enter your new password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          type="password"
          value={formValues.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
        isLoading={loading}
        colorScheme="blue"
      >
        Reset Password
      </Button>
    </form>
  );
};

export default AdminResetPasswordForm;

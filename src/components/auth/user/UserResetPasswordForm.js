import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetUserPassword,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as Yup from "yup";

const UserResetPasswordForm = () => {
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
  const [errors, setErrors] = useState({});

  // Clear status on component mount
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
        description: error?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validateForm = () => {
    const validationErrors = {};
    const { email, password, confirmPassword } = formValues;

    // Email validation
    if (!email) validationErrors.email = "Required";
    else if (!Yup.string().email().isValidSync(email)) validationErrors.email = "Invalid email address";

    // Password validation
    if (!password) validationErrors.password = "Required";
    else if (password.length < 8) validationErrors.password = "Password must be at least 8 characters";

    // Confirm Password validation
    if (!confirmPassword) validationErrors.confirmPassword = "Required";
    else if (confirmPassword !== password) validationErrors.confirmPassword = "Passwords must match";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const resultAction = await dispatch(resetUserPassword(formValues));
      if (resetUserPassword.fulfilled.match(resultAction)) {
        // Successful reset
        setFormValues({ email: "", password: "", confirmPassword: "" }); // Clear form
      } else {
        // Error handled by Redux state
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

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mb={4} isInvalid={!!errors.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          placeholder="Enter your email"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.password}>
        <FormLabel>New Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          placeholder="Enter your new password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          type="password"
          value={formValues.confirmPassword}
          onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
          placeholder="Confirm your new password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
      </FormControl>

      <Button
        type="submit"
        colorScheme="green"
        w="full"
        isLoading={loading}
      >
        Reset Password
      </Button>
    </form>
  );
};

export default UserResetPasswordForm;

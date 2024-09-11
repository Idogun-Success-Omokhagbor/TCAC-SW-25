import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  resetAdminPassword,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  useToast,
  Box,
} from "@chakra-ui/react";

const SuperAdminResetPasswordForm = () => {
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
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

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
        description: error?.message || "An error occurred during the password reset.",
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
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
    if (!password) {
      errors.password = "Required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    } else if (!confirmPassword) {
      errors.confirmPassword = "Required";
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
        // Clear form values
        setFormValues({
          email: "",
          password: "",
          confirmPassword: "",
        });
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
      <FormControl mb={4} isInvalid={formErrors.email && touched.email}>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, email: true })}
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

      <FormControl mb={4} isInvalid={formErrors.password && touched.password}>
        <FormLabel>New Password</FormLabel>
        <Input
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, password: true })}
          placeholder="Enter new password"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={formErrors.confirmPassword && touched.confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          name="confirmPassword"
          type="password"
          value={formValues.confirmPassword}
          onChange={handleChange}
          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
          placeholder="Confirm new password"
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

export default SuperAdminResetPasswordForm;

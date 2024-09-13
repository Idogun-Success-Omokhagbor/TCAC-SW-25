import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  resetSuperAdminPassword,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";
import {
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormErrorMessage,
  useToast,
  Box,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to toggle visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

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
      const resultAction = await dispatch(resetSuperAdminPassword(formValues));
      
      if (resetSuperAdminPassword.fulfilled.match(resultAction)) {
        // Success case
        toast({
          title: "Success!",
          description: "Password reset successful. Redirecting to login...",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top"
        });
        router.push(`/login/${role}`);
        
        // Clear form values
        setFormValues({
          email: "",
          password: "",
          confirmPassword: "",
        });

      } else {
        // Handle error from Redux
        const errorMessage = resultAction.payload?.message || resultAction.error?.message || "An error occurred during the password reset.";
        toast({
          title: "Error!",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top"
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
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
          // placeholder="Enter your email"
          _focus={{
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
            border: "2px solid",
            borderColor: "green",
            transition: "border-color 0.3s ease",
          }}
        />
        <FormErrorMessage>{formErrors.email}</FormErrorMessage>
      </FormControl>

      {/* Password */}
      <FormControl mb={4} isInvalid={formErrors.password && touched.password}>
        <FormLabel>New Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={handleChange}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
          <InputRightElement>
            <Button
              variant="link"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formErrors.password}</FormErrorMessage>
      </FormControl>

      {/* Confirm Password */}
      <FormControl mb={4} isInvalid={formErrors.confirmPassword && touched.confirmPassword}>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
          <InputRightElement>
            <Button
              variant="link"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{formErrors.confirmPassword}</FormErrorMessage>
      </FormControl>

      <Button
        type="submit"
        w="full"
      isLoading={loading}
        loadingText="Processing..."
        colorScheme="green"
      >
        Reset Password
      </Button>
    </form>
  );
};

export default SuperAdminResetPasswordForm;

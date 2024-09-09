// components/auth/admin/AdminRegistrationForm.js
import React, { useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const SuperAdminRegistrationForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  // Clear status on component mount
  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    // Ensure the role is "Super Admin" if the role passed is "super_admin"
    if (role === "super_admin") {
      values.role = "Super Admin";
    }

    try {
      const resultAction = await dispatch(registerSuperAdmin(values));
      if (registerSuperAdmin.fulfilled.match(resultAction)) {
        // Successful reset
        resetForm();
        // Redirect to login page after successful reset
        router.push(`/login/${role}`);
      } else {
        // Error handled by Redux state
        console.log("Error: ", resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", phoneNumber: "" }}
      validationSchema={Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        phoneNumber: Yup.string().required('Required'),
      })}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <FormControl id="firstName" isInvalid={errors.firstName && touched.firstName}>
            <FormLabel>First Name</FormLabel>
            <Field
              name="firstName"
              type="text"
              as={Input}
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
          </FormControl>

          <FormControl id="lastName" isInvalid={errors.lastName && touched.lastName} mt={4}>
            <FormLabel>Last Name</FormLabel>
            <Field
              name="lastName"
              type="text"
              as={Input}
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
          </FormControl>

          <FormControl id="email" isInvalid={errors.email && touched.email} mt={4}>
            <FormLabel>Email Address</FormLabel>
            <Field
              name="email"
              type="email"
              as={Input}
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
          </FormControl>

          <FormControl id="phoneNumber" isInvalid={errors.phoneNumber && touched.phoneNumber} mt={4}>
            <FormLabel>
              Phone Number <Box as="span" fontSize="sm" color="gray.500">(WhatsApp enabled)</Box>
            </FormLabel>
            <Field
              name="phoneNumber"
              type="tel"
              as={Input}
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
            w="full"
            isLoading={isSubmitting || loading}
            colorScheme="blue"
            mt={4}
          >
            Register
          </Button>

          {status === "succeeded" && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Registration successful. Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {status === "failed" && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                {error?.message || "An error occurred"}
              </AlertDescription>
            </Alert>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default SuperAdminRegistrationForm;

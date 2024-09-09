import React, { useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAdminPassword,
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const AdminResetPasswordForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { role = "user" } = router.query;

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);


   // Clear status on component mount
   useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);


  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const resultAction = await dispatch(resetAdminPassword(values));
      if (resetAdminPassword.fulfilled.match(resultAction)) {
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
      // Global error handling
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Field name="email" type="email" as={Input} 
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>New Password</FormLabel>
              <Field name="password" type="password" as={Input} 
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Confirm Password</FormLabel>
              <Field name="confirmPassword" type="password" as={Input} 
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
              />
            </FormControl>

            <Button type="submit"  w={"full"} isLoading={isSubmitting || loading} colorScheme="blue">
              Reset Password
            </Button>

            {status === "succeeded" && (
              <Alert status="success" mt={4}>
                <AlertIcon />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Password reset successful. Redirecting to login...
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
    </>
  );
};

export default AdminResetPasswordForm;

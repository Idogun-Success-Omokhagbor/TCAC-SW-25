import React, {useEffect} from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginSuperAdmin,
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  FormErrorMessage,
} from "@chakra-ui/react";

const SuperAdminLoginForm = ({ role }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);

  // Clear status on component mount
  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setAlertStatus("success");
      setAlertMessage("Login successful. Redirecting to your dashboard...");
    } else if (status === "failed") {
      setAlertStatus("error");
      setAlertMessage(error?.message || "Login failed. Please try again.");
    }
  }, [status, error]);

  const handleLogin = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const resultAction = await dispatch(loginSuperAdmin({ ...values, role }));
      if (loginSuperAdmin.fulfilled.match(resultAction)) {
        resetForm();
        router.push(`/dashboard/${role}`);
      } else {
        setAlertStatus("error");
        setAlertMessage("Failed to login. Please try again later.");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setAlertStatus("error");
      setAlertMessage("An unexpected error occurred. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Required"),
        })}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FormControl mb={4} isInvalid={errors.email && touched.email}>
              <FormLabel>Email</FormLabel>
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
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl mb={4} isInvalid={errors.password && touched.password}>
              <FormLabel>Password</FormLabel>
              <Field
                name="password"
                type="password"
                as={Input}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              w={"full"}
              isLoading={isSubmitting || loading}
              colorScheme="blue"
            >
              Login
            </Button>

            {alertMessage && (
              <Alert status={alertStatus} mt={4}>
                <AlertIcon />
                <AlertTitle>
                  {alertStatus === "error" ? "Login Failed" : "Success"}
                </AlertTitle>
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SuperAdminLoginForm;

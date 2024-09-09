import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  loginUser,
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
import { useEffect, useState } from "react";

const UserLoginForm = ({ role }) => {
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
      const resultAction = await dispatch(loginUser({ ...values, role }));
      if (loginUser.fulfilled.match(resultAction)) {
        const userData = resultAction.payload;
        if (userData.registrationStatus === "pending") {
          setAlertStatus("info");
          setAlertMessage(
            "Your account is pending approval. Please check back later."
          );
        } else if (userData.registrationStatus === "rejected") {
          setAlertStatus("error");
          setAlertMessage(
            "Your account has been rejected. Please contact support or re-register."
          );
        } else {
          // Successful reset
          resetForm();

          // Redirect to login page after successful login
          router.push(`/dashboard/${role}`);
        }
      } else {
        // Error handled by Redux state
        console.log("Error: ", resultAction.payload || resultAction.error);
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
        {({ isSubmitting }) => (
          <Form>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Field name="email" type="email" as={Input}  _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
                />
            </FormControl>

            <FormControl mb={4}>
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
            </FormControl>

            <Button
              type="submit"
              w={"full"}
              colorScheme="green"
              isLoading={isSubmitting || loading}
            >
              Login
            </Button>

            {alertMessage && (
              <Alert status={alertStatus} mt={4}>
                <AlertIcon />
                <AlertTitle>
                  {alertStatus === "info"
                    ? "Pending Approval"
                    : alertStatus === "error"
                    ? "Registration Rejected"
                    : "Success"}
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

export default UserLoginForm;

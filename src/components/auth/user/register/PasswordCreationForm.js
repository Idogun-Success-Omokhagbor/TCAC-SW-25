import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  registerUser,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../../store/slices/auth/user/userAuthSlice";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";

const PasswordCreationForm = ({ role, values, onValuesChange, onPrevious }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  // Clear status on component mount
  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  const handleSubmit = async (AllFormValues, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    // Set role to "User" if it is "user"
    const userRole = role.toLowerCase() === "user" ? "User" : role;

    try {
      const mergedValues = { role: userRole, ...values, ...AllFormValues };
      const resultAction = await dispatch(registerUser(mergedValues));

      if (registerUser.fulfilled.match(resultAction)) {
        // Successful registration
        resetForm();

        router.push(`/login/${adjustedRole}`);
      } else {
        // Error handled by Redux state
        console.log("Error: ", resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        password: values.password || "",
        confirmPassword: values.confirmPassword || "",
      }}
      validationSchema={Yup.object({
        password: Yup.string()
          .min(8, "Must be at least 8 characters")
          .required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Required"),
      })}
      onSubmit={(AllFormValues, { setSubmitting }) => {
        onValuesChange(AllFormValues); // Update the password values in the parent state
        handleSubmit(AllFormValues, { setSubmitting }); // Proceed to handle submission
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Stack spacing={4}>
            {/* Password Field */}
            <FormControl
              id="password"
              isInvalid={errors.password && touched.password}
            >
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

            {/* Confirm Password Field */}
            <FormControl
              id="confirm-password"
              isInvalid={errors.confirmPassword && touched.confirmPassword}
            >
              <FormLabel>Confirm Password</FormLabel>
              <Field
                name="confirmPassword"
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

            {/* Navigation Buttons */}
            <Stack direction="row" spacing={4} mt={4}>
              <Button
                type="button"
                colorScheme="gray"
                size="lg"
                w="full"
                onClick={onPrevious}
              >
                Back
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                w="full"
                isLoading={isSubmitting || loading}
              >
                Submit
              </Button>
            </Stack>

            {/* Notifications */}
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
                  {error?.message || "Registration failed. Please try again."}
                </AlertDescription>
              </Alert>
            )}
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordCreationForm;

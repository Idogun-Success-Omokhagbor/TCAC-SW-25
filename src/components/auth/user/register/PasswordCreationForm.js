import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { MdLock, MdLockOutline } from "react-icons/md";
import {
  registerUser,
  selectAuthLoading,
  selectAuthStatus,
  selectAuthError,
  clearStatus,
} from "../../../../store/slices/auth/user/userAuthSlice";

const PasswordCreationForm = ({ role, values, onValuesChange, onPrevious, prevFormValues }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const loading = useSelector(selectAuthLoading);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formValues, setFormValues] = useState({
    password: values?.password || "",
    confirmPassword: values?.confirmPassword || "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  // Clear status on component mount
  useEffect(() => {
    dispatch(clearStatus());
  }, [dispatch]);

  useEffect(() => {
    if (status === "success") {
      toast({
        title: "Success!",
        description: "Registration successful. Redirecting to login...",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setFormValues({ password: "", confirmPassword: "" }); // Clear form
      router.push(`/login/${role.toLowerCase() === "user" ? "User" : role}`);
    }
    if (status === "error") {
      toast({
        title: "Error!",
        description: error || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status, error, router, role, toast]);

  const validate = () => {
    const newErrors = {};
    const { password, confirmPassword } = formValues;

    if (!password) newErrors.password = "Required";
    else if (password.length < 8) newErrors.password = "Must be at least 8 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Required";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const userRole = role.toLowerCase() === "user" ? "User" : role;

    try {
      const mergedValues = { role, ...values,  ...prevFormValues, ...formValues };

      console.log('merged values:', mergedValues);

      const resultAction = await dispatch(registerUser(mergedValues));

      if (registerUser.fulfilled.match(resultAction)) {
        // Success handled by effect hook
      } else {
        // Error handled by effect hook
        console.log("Error: ", resultAction.payload || resultAction.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Password Field */}
        <FormControl id="password" isInvalid={!!errors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
            placeholder="Enter your password"
            leftIcon={<MdLock />}
          />
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            name="confirmPassword"
            type="password"
            value={formValues.confirmPassword}
            onChange={(e) => setFormValues({ ...formValues, confirmPassword: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
            placeholder="Re-enter your password"
            leftIcon={<MdLockOutline />}
          />
        </FormControl>

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button
            type="button"
            colorScheme="gray"
            size="lg"
            w="full"
            onClick={() => onPrevious(values)}
          >
            Back
          </Button>
          <Button
            type="submit"
            colorScheme="green"
            size="lg"
            w="full"
            isLoading={loading}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default PasswordCreationForm;

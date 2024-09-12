import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";

const PersonalInformationForm = ({ role, values, onValuesChange, onNext }) => {
  // State for form input values
  const [inputValues, setInputValues] = useState({
    firstName: values?.firstName || '',
    lastName: values?.lastName || '',
    email: values?.email || '',
    phoneNumber: values?.phoneNumber || '',
  });
  // State for form errors
  const [formErrors, setFormErrors] = useState({});
  // Toast hook for showing messages
  const toast = useToast();

  // Function to validate form input
  const validateForm = () => {
    const validationErrors = {};
    const { firstName, lastName, email, phoneNumber } = inputValues;

    if (!firstName) validationErrors.firstName = "First name is required";
    if (!lastName) validationErrors.lastName = "Last name is required";
    if (!email) validationErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = "Invalid email address";
    if (!phoneNumber) validationErrors.phoneNumber = "Phone number is required";
    else if (!/^[0-9]+$/.test(phoneNumber)) validationErrors.phoneNumber = "Phone number must be digits only";
    else if (phoneNumber.length < 10) validationErrors.phoneNumber = "Phone number must be at least 10 digits";
    else if (phoneNumber.length > 15) validationErrors.phoneNumber = "Phone number must be at most 15 digits";

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Show errors using toast
      Object.values(formErrors).forEach((error) => {
        toast({
          title: "Validation Error",
          description: error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
      return;
    }

    const updatedValues = { ...values, role, ...inputValues };
    onValuesChange(updatedValues);
    onNext(updatedValues);

    // Show success message using toast
    toast({
      title: "Success",
      description: "Personal information updated successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* First Name Field */}
        <FormControl id="firstName" isInvalid={!!formErrors.firstName}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            value={inputValues.firstName}
            onChange={(e) => setInputValues({ ...inputValues, firstName: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Last Name Field */}
        <FormControl id="lastName" isInvalid={!!formErrors.lastName}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            value={inputValues.lastName}
            onChange={(e) => setInputValues({ ...inputValues, lastName: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Email Field */}
        <FormControl id="email" isInvalid={!!formErrors.email}>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={inputValues.email}
            onChange={(e) => setInputValues({ ...inputValues, email: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Phone Number Field */}
        <FormControl id="phoneNumber" isInvalid={!!formErrors.phoneNumber}>
          <FormLabel>
            Phone Number{" "}
            <Box as="span" fontSize="sm" color="gray.500">
              (WhatsApp enabled)
            </Box>
          </FormLabel>
          <Input
            type="tel"
            value={inputValues.phoneNumber}
            onChange={(e) => setInputValues({ ...inputValues, phoneNumber: e.target.value })}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          />
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" colorScheme="green" size="lg" w="full" mt={4}>
          Next
        </Button>
      </Stack>
    </form>
  );
};

export default PersonalInformationForm;

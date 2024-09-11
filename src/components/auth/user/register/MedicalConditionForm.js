import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select as ChakraSelect,
  Stack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

const MedicalConditionForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  // Initialize state with passed values or default values
  const [medicalCondition, setMedicalCondition] = useState(values?.medicalCondition || "no");
  const [conditionDetails, setConditionDetails] = useState(values?.conditionDetails || "");
  const [hasMedicalCondition, setHasMedicalCondition] = useState(medicalCondition === "yes");

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    medicalCondition: "",
    conditionDetails: "",
  });
  
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Validation logic
    const validationErrors = {
      medicalCondition: "",
      conditionDetails: "",
    };

    if (!medicalCondition) {
      validationErrors.medicalCondition = "Required";
      isFormValid = false;
    }

    if (hasMedicalCondition && !conditionDetails) {
      validationErrors.conditionDetails = "Condition details are required when medical condition is 'yes'";
      isFormValid = false;
    }

    if (!isFormValid) {
      setFormErrors(validationErrors);
      toast({
        title: "Error",
        description: "Please correct the errors in the form.",
        status: "error",
        duration: 5000,
        isClosable: true,
        icon: <FaExclamationCircle />,
      });
      return;
    }

    // Proceed with form submission
    const formValues = { medicalCondition, conditionDetails };
    console.log("Medical Form values:", formValues);
    const mergedValues = {role, ...values, ...prevFormValues, ...formValues };
    console.log("Registration Form merged values:", mergedValues);
    onValuesChange(mergedValues);
    onNext(mergedValues);

    toast({
      title: "Success",
      description: "Form submitted successfully!",
      status: "success",
      duration: 5000,
      isClosable: true,
      icon: <FaCheckCircle />,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={4}>
        {/* Medical Condition Selector */}
        <FormControl isInvalid={!!formErrors.medicalCondition}>
          <FormLabel>Do you have any medical condition?</FormLabel>
          <ChakraSelect
            value={medicalCondition}
            onChange={(e) => {
              const value = e.target.value;
              setMedicalCondition(value);
              setHasMedicalCondition(value === "yes");
            }}
            _focus={{
              boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
              border: "2px solid",
              borderColor: "green",
              transition: "border-color 0.3s ease",
            }}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </ChakraSelect>
          <FormErrorMessage>{formErrors.medicalCondition}</FormErrorMessage>
        </FormControl>

        {/* Conditional Field for Medical Condition Details */}
        {hasMedicalCondition && (
          <FormControl isInvalid={!!formErrors.conditionDetails}>
            <FormLabel>Please specify your medical condition</FormLabel>
            <Textarea
              value={conditionDetails}
              onChange={(e) => setConditionDetails(e.target.value)}
              placeholder="Enter details"
              _focus={{
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                border: "2px solid",
                borderColor: "green",
                transition: "border-color 0.3s ease",
              }}
            />
            <FormErrorMessage>{formErrors.conditionDetails}</FormErrorMessage>
          </FormControl>
        )}

        {/* Navigation Buttons */}
        <Stack direction="row" spacing={4} mt={4}>
          <Button
            type="button"
            colorScheme="gray"
            onClick={onPrevious}
          >
            Back
          </Button>
          <Button type="submit" colorScheme="green">
            Next
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default MedicalConditionForm;

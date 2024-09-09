import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select as ChakraSelect,
  Stack,
} from "@chakra-ui/react";
import * as Yup from "yup";

const MedicalConditionForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
}) => {
  const [hasMedicalCondition, setHasMedicalCondition] = useState(false);

  return (
    <Formik
      initialValues={values}
      validationSchema={Yup.object({
        medicalCondition: Yup.string().required("Required"),
      })}
      onSubmit={(newValues) => {
        console.log("Medical Info:", newValues);
        const mergedValues = { role, ...values, ...newValues }; // Merge values from all previous steps
        onValuesChange(mergedValues);
        onNext(mergedValues);
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Do you have any medical condition?</FormLabel>
              <ChakraSelect
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("medicalCondition", value);
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
            </FormControl>

            {hasMedicalCondition && (
              <FormControl>
                <FormLabel>Please specify your medical condition</FormLabel>
                <Field
                  as={Textarea}
                  name="conditionDetails"
                  placeholder="Enter details"
                  _focus={{
                    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                    border: "2px solid",
                    borderColor: "green",
                    transition: "border-color 0.3s ease",
                  }}
                />
              </FormControl>
            )}

            <Stack direction="row" spacing={4} mt={4}>
              <Button type="button" colorScheme="gray" onClick={onPrevious}>
                Back
              </Button>
              <Button type="submit" colorScheme="green" >
                Next
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default MedicalConditionForm;

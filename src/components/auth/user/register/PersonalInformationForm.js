import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const PersonalInformationForm = ({ role, values, onValuesChange }) => {
  return (
    <Formik
      initialValues={values}
      validationSchema={Yup.object({
        firstName: Yup.string().required("Required"),
        lastname: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        phoneNumber: Yup.string().required("Required"),
      })}
      onSubmit={(newValues) => {
        console.log("Personal Info:", newValues);
        const mergedValues = { ...values, role, ...newValues }; // Merge with previous values
        onValuesChange(mergedValues);
        onNext(mergedValues);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Stack spacing={4}>
            <FormControl
              id="firstName"
              isInvalid={errors.firstName && touched.firstName}
            >
              <FormLabel>First name</FormLabel>
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

            <FormControl
              id="lastName"
              isInvalid={errors.lastName && touched.lastName}
            >
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

            <FormControl id="email" isInvalid={errors.email && touched.email}>
              <FormLabel>Email address</FormLabel>
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

            <FormControl
              id="phoneNumber"
              isInvalid={errors.phoneNumber && touched.phoneNumber}
            >
              <FormLabel>
                Phone number{" "}
                <Box as="span" fontSize="sm" color="gray.500">
                  (WhatsApp enabled)
                </Box>
              </FormLabel>
              <Field
                name="phone"
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

            <Button type="submit" colorScheme="green" size="lg" w="full" mt={4}>
              Next
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalInformationForm;

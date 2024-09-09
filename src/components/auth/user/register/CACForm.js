import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Select as ChakraSelect,
  Checkbox,
} from "@chakra-ui/react";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

import NaijaStates from "naija-state-local-government";

// Get all Nigerian states
const allStates = NaijaStates.states();

// console.log(allStates);

const CACForm = ({ role, values, onValuesChange, onNext, onPrevious }) => {
  const [userCategory, setUserCategory] = useState("Student");
  const [institutions, setInstitutions] = useState({});
  const [isInstitutionOther, setIsInstitutionOther] = useState(false);
  const [isStateOther, setIsStateOther] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch("/institutions.json")
      .then((response) => response.json())
      .then((data) => setInstitutions(data.institutions))
      .catch((error) => console.error("Error fetching institutions:", error));
  }, []);

  const renderInstitutionOptions = (institutionList) => {
    return institutionList.map((institution, index) => (
      <option key={index} value={institution.name}>
        {institution.name} - {institution.location}
      </option>
    ));
  };

  const handleUserCategoryChange = (e) => {
    setUserCategory(e.target.value);
    if (e.target.value === "Non-TIMSANITE") {
      setIsStudent(false); // Reset isStudent if not a TIMSANITE
    }
  };

  const handleInstitutionChange = (e) => {
    setIsInstitutionOther(e.target.value === "Other");
  };

  const handleStateChange = (e) => {
    setIsStateOther(e.target.value === "Other");
  };

  const renderConditionalFields = () => {
    switch (userCategory) {
      case "Student":
      case "Alumnus":
        return (
          <>
            {/* institution */}
            <FormControl>
              <FormLabel>Institution</FormLabel>
              <ChakraSelect
                placeholder="Select institution"
                id="institution"
                name="institution"
                onChange={handleInstitutionChange}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              >
                <optgroup label="Federal Universities">
                  {renderInstitutionOptions(
                    institutions.universities?.federal || []
                  )}
                </optgroup>
                <optgroup label="State Universities">
                  {renderInstitutionOptions(
                    institutions.universities?.state || []
                  )}
                </optgroup>
                <optgroup label="Private Universities">
                  {renderInstitutionOptions(
                    institutions.universities?.private || []
                  )}
                </optgroup>
                <optgroup label="Federal Polytechnics">
                  {renderInstitutionOptions(
                    institutions.polytechnics?.federal || []
                  )}
                </optgroup>
                <optgroup label="State Polytechnics">
                  {renderInstitutionOptions(
                    institutions.polytechnics?.state || []
                  )}
                </optgroup>
                <optgroup label="Private Polytechnics">
                  {renderInstitutionOptions(
                    institutions.polytechnics?.private || []
                  )}
                </optgroup>
                <optgroup label="Federal Colleges of Education">
                  {renderInstitutionOptions(
                    institutions.colleges_of_education?.federal || []
                  )}
                </optgroup>
                <optgroup label="State Colleges of Education">
                  {renderInstitutionOptions(
                    institutions.colleges_of_education?.state || []
                  )}
                </optgroup>
                <optgroup label="Private Colleges of Education">
                  {renderInstitutionOptions(
                    institutions.colleges_of_education?.private || []
                  )}
                </optgroup>
              </ChakraSelect>
              {isInstitutionOther && (
                <Field
                  as={Input}
                  name="otherInstitution"
                  placeholder="Enter Institution Name"
                />
              )}
            </FormControl>

            {/* Alumnus fields */}
            {userCategory === "Alumnus" && (
              <FormControl>
                <FormLabel>Year of Graduation</FormLabel>
                <Field
                  as={Input}
                  type="number"
                  name="graduationYear"
                  placeholder="Select Year"
                  _focus={{
                    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                    border: "2px solid",
                    borderColor: "green",
                    transition: "border-color 0.3s ease",
                  }}
                />
              </FormControl>
            )}

            <FormControl>
              <FormLabel>State</FormLabel>
              <ChakraSelect
                onChange={handleStateChange}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="">Select State</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
                <option value="Other">Other</option>
              </ChakraSelect>
              {isStateOther && (
                <Field as={Input} name="otherState" placeholder="Enter State" />
              )}
            </FormControl>
          </>
        );

      case "Child":
        return (
          <>
            <FormControl>
              <FormLabel>Guardian Name</FormLabel>
              <Field
                as={Input}
                name="guardianName"
                placeholder="Enter Guardian Name"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Guardian Phone Number</FormLabel>
              <Field
                as={Input}
                name="guardianPhone"
                placeholder="Enter Guardian Phone"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Guardian Address</FormLabel>
              <Field
                as={Input}
                name="guardianAddress"
                placeholder="Enter Guardian Address"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>
          </>
        );

      case "Non-TIMSANITE":
        return (
          <>
            <FormControl>
              <FormLabel>Are you a Student?</FormLabel>
              <ChakraSelect
                onChange={(e) => setIsStudent(e.target.value === "yes")}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </ChakraSelect>
            </FormControl>

            {isStudent && (
              <>
                <FormControl>
                  <FormLabel>Institution</FormLabel>
                  <Field
                    as={Input}
                    name="nonTimsaniteInstitution"
                    placeholder="Enter Institution"
                    _focus={{
                      boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                      border: "2px solid",
                      borderColor: "green",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Field
                    as={Input}
                    name="nonTimsaniteState"
                    placeholder="Enter State"
                    _focus={{
                      boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                      border: "2px solid",
                      borderColor: "green",
                      transition: "border-color 0.3s ease",
                    }}
                  />
                </FormControl>
              </>
            )}

            <FormControl>
              <FormLabel>Next of Kin Name</FormLabel>
              <Field
                as={Input}
                name="nextOfKinName"
                placeholder="Enter Next of Kin Name"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Next of Kin Phone</FormLabel>
              <Field
                as={Input}
                name="nextOfKinPhone"
                placeholder="Enter Next of Kin Phone"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Next of Kin Address</FormLabel>
              <Field
                as={Input}
                name="nextOfKinAddress"
                placeholder="Enter Next of Kin Address"
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={{
        userCategory: "Student",
        institution: "",
        state: "",
        guardianName: "",
        guardianPhone: "",
        guardianAddress: "",
        nextOfKinName: "",
        nextOfKinPhone: "",
        nextOfKinAddress: "",
      }}
      validationSchema={Yup.object({
        userCategory: Yup.string().required("Please select a category"),
        // Add validation for other fields as needed
      })}
      onSubmit={(newValues) => {
        console.log("Attendee Info:", newValues);
        const mergedValues = { role, ...values, ...newValues }; // Merge values from the previous step
        onValuesChange(mergedValues);
        onNext(mergedValues);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <Stack spacing={4}>
            <FormControl id="user-category">
              <FormLabel>Register as</FormLabel>
              <ChakraSelect
                onChange={handleUserCategoryChange}
                value={userCategory}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="Student">Student (TIMSANITE)</option>
                <option value="Alumnus">Alumnus (IOTB)</option>
                <option value="Child">Child</option>
                <option value="Non-TIMSANITE">Non-TIMSANITE</option>
              </ChakraSelect>
            </FormControl>

            {renderConditionalFields()}

            <Stack direction="row" spacing={4} mt={4}>
              <Button type="button" colorScheme="gray" onClick={onPrevious}>
                Back
              </Button>
              <Button type="submit" colorScheme="green">
                Next
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default CACForm;

import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Select,
  Text,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";

const PaymentForm = ({ role, values, onValuesChange, onNext, onPrevious }) => {
  const [minAmount, setMinAmount] = useState(5000); // Default to ₦5000
  const inputFileRef = useRef(null);
  const toast = useToast();

  const bankDetails = {
    accountName: "John Doe",
    accountNumber: "1234567890",
    bank: "Example Bank",
  };

  const handleAmountChange = (paymentType, campType) => {
    if (campType === "Camp Only") {
      setMinAmount(paymentType === "Full Payment" ? 5000 : 3000);
    } else if (campType === "Conference Only") {
      setMinAmount(paymentType === "Full Payment" ? 15000 : 5000);
    } else if (campType === "Camp and Conference") {
      setMinAmount(paymentType === "Full Payment" ? 20000 : 5000);
    }
  };

  const handleCopy = (text, label) => {
    toast({
      title: `${label} copied to clipboard!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Formik
      initialValues={values}
      validationSchema={Yup.object({
        paymentType: Yup.string().required("Required"),
        campType: Yup.string().required("Required"),
        amount: Yup.number()
          .min(minAmount, `Minimum amount is ₦${minAmount}`)
          .required("Required"),
        receipt: Yup.mixed().required("Receipt upload is required"),
      })}
      onSubmit={async (newValues, { setSubmitting }) => {
        try {
          // Handle file upload
          const file = inputFileRef.current.files[0];
          if (file) {
            const newBlob = await upload(file.name, file, { access: "public" });
            const receiptUrl = newBlob.url;

            // Merge previous values and the current form values
            const mergedValues = {
              role,
              ...values,
              ...newValues,
              amount: minAmount,
              receiptUrl,
            };
            onValuesChange(mergedValues);
            onNext(mergedValues);
          } else {
            console.error("No receipt file selected");
          }
        } catch (error) {
          console.error("File upload failed", error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, setFieldValue, values }) => (
        <Form>
          <Box display={"flex"} flexDirection={"column"} gap={6}>
            {/* Bank Account Details */}
            <Flex
              flexDirection={"column"}
              // marginLeft={"auto"}
              gap={4}
              bg="gray.100"
              p={4}
              borderRadius="md"
            >
              <Text fontWeight="bold" mb={2}>
                Bank Account Details
              </Text>

              <Stack spacing={6}>
                {/* account name */}
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Text>
                    <strong>Account Name:</strong> {bankDetails.accountName}
                  </Text>
                  <CopyToClipboard
                    text={bankDetails.accountName}
                    onCopy={() =>
                      handleCopy(bankDetails.accountName, "Account Name")
                    }
                  >
                    <IconButton
                      icon={<FaCopy />}
                      size="sm"
                      aria-label="Copy Account Name"
                    />
                  </CopyToClipboard>
                </Box>

                {/* account number */}
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Text>
                    <strong>Account Number:</strong> {bankDetails.accountNumber}
                  </Text>
                  <CopyToClipboard
                    text={bankDetails.accountNumber}
                    onCopy={() =>
                      handleCopy(bankDetails.accountNumber, "Account Number")
                    }
                  >
                    <IconButton
                      icon={<FaCopy />}
                      size="sm"
                      aria-label="Copy Account Number"
                    />
                  </CopyToClipboard>
                </Box>

                {/* bank */}
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                >
                  <Text>
                    <strong>Bank:</strong> {bankDetails.bank}
                  </Text>
                  <CopyToClipboard
                    text={bankDetails.bank}
                    onCopy={() => handleCopy(bankDetails.bank, "Bank")}
                  >
                    <IconButton
                      icon={<FaCopy />}
                      size="sm"
                      aria-label="Copy Bank"
                    />
                  </CopyToClipboard>
                </Box>
              </Stack>
            </Flex>

            {/* payment form fields */}
            {/* Mode of Payment */}
            <FormControl
              id="paymentType"
              isInvalid={errors.paymentType && touched.paymentType}
            >
              <FormLabel>Mode of Payment</FormLabel>
              <Field
                name="paymentType"
                as={Select}
                onChange={(e) => {
                  const paymentType = e.target.value;
                  setFieldValue("paymentType", paymentType);
                  handleAmountChange(paymentType, values.campType);
                }}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="Full Payment">Full Payment</option>
                <option value="Installmental Payment">
                  Installmental Payment
                </option>
              </Field>
            </FormControl>

            {/* Camp/Conference Selection */}
            <FormControl
              id="campType"
              isInvalid={errors.campType && touched.campType}
            >
              <FormLabel>What part of the Camp/Conference?</FormLabel>
              <Field
                name="campType"
                as={Select}
                onChange={(e) => {
                  const campType = e.target.value;
                  setFieldValue("campType", campType);
                  handleAmountChange(values.paymentType, campType);
                }}
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              >
                <option value="Camp Only">Camp Only</option>
                <option value="Conference Only">Conference Only</option>
                <option value="Camp and Conference">Camp and Conference</option>
              </Field>
            </FormControl>

            {/* Amount (automatically set based on selection) */}
            <FormControl
              id="amount"
              isInvalid={errors.amount && touched.amount}
            >
              <FormLabel>Amount</FormLabel>
              <Field
                name="amount"
                type="number"
                as={Input}
                value={minAmount}
                readOnly
                _focus={{
                  boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                  border: "2px solid",
                  borderColor: "green",
                  transition: "border-color 0.3s ease",
                }}
              />
            </FormControl>

            {/* Payment Receipt (File Upload) */}
            <FormControl
              id="receipt"
              isInvalid={errors.receipt && touched.receipt}
            >
              <FormLabel>Upload Payment Receipt</FormLabel>
              <InputGroup>
                {/* Hide default file input placeholder text */}
                <Input
                  type="file"
                  ref={inputFileRef}
                  onChange={(e) => setFieldValue("receipt", e.target.files[0])}
                  sx={{
                    "&::file-selector-button": {
                      display: "none", // Hide the default file input button
                    },
                    // Additional styles to hide default text
                    "&::-webkit-file-upload-button": {
                      display: "none", // For WebKit browsers
                    },
                    appearance: "none", // Remove default styling
                  }}
                  _focus={{
                    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
                    border: "2px solid",
                    borderColor: "green",
                    transition: "border-color 0.3s ease",
                  }}
                />
                <InputRightElement>
                  <MdAttachFile
                    className="h-6 w-6"
                    onClick={() => inputFileRef.current.click()}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Buttons */}
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
              <Button type="submit" colorScheme="green" size="lg" w="full">
                Next
              </Button>
            </Stack>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PaymentForm;

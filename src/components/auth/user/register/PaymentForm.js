import React, { useState, useRef } from "react";
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
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PaymentForm = ({
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
}) => {
  const [formValues, setFormValues] = useState({
    paymentType: values?.paymentType || "",
    campType: values?.campType || "",
    amount: values?.amount || "",
    receipt: values?.receipt || "",
    paymentNarration: values?.paymentNarration || "",
  });
  const [minimumAmountRequired, setMinimumAmountRequired] = useState(5000); // Default to ₦5000
  const [formErrors, setFormErrors] = useState({});
  const [blobDetails, setBlobDetails] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state

  const inputFileRef = useRef(null);
  const toast = useToast();

  const bankAccountDetails = {
    accountName: "John Doe",
    accountNumber: "1234567890",
    bank: "Example Bank",
  };

  const handlePaymentAmountChange = (paymentType, campType) => {
    if (campType === "Camp Only") {
      setMinimumAmountRequired(paymentType === "Full Payment" ? 5000 : 3000);
    } else if (campType === "Conference Only") {
      setMinimumAmountRequired(paymentType === "Full Payment" ? 15000 : 5000);
    } else if (campType === "Camp and Conference") {
      setMinimumAmountRequired(paymentType === "Full Payment" ? 20000 : 5000);
    }
  };

  const handleCopyToClipboard = (text, label) => {
    toast({
      title: `${label} copied to clipboard!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formValues.paymentType)
      validationErrors.paymentType = "Payment type is required";
    if (!formValues.campType)
      validationErrors.campType = "Camp type is required";
    if (!formValues.amount || formValues.amount < minimumAmountRequired)
      validationErrors.amount = `Minimum amount is ₦${minimumAmountRequired}`;
    if (!formValues.receipt)
      validationErrors.receipt = "Receipt upload is required";

    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Set loading to true when starting the submission

    try {
      const file = inputFileRef.current.files[0];
      if (!file) {
        console.error("No file selected");
        setLoading(false); // Set loading to false if no file is selected
        return;
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload the file using Vercel Blob API
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      const { url } = result;

      setBlobDetails({ url });
      console.log("File uploaded successfully:", result);

      // Merge previous values and the current form values
      const mergedValues = {
        role,
        ...values,
        ...prevFormValues,
        ...formValues,
        receiptUrl: url,
      };

      console.log("merged values:", mergedValues);

      onValuesChange(mergedValues);
      onNext(mergedValues);
      toast({
        title: "Success",
        description: "Payment data updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("File upload failed", error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Set loading to false when submission is complete
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Box display={"flex"} flexDirection={"column"} gap={6}>
        {/* Bank Account Details */}
        <Flex
          flexDirection={"column"}
          gap={4}
          bg="gray.100"
          p={4}
          borderRadius="md"
        >
          <Text fontWeight="bold" mb={2}>
            Bank Account Details
          </Text>

          <Stack spacing={6}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Name:</strong> {bankAccountDetails.accountName}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountName}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountName,
                    "Account Name"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Name"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Account Number:</strong>{" "}
                {bankAccountDetails.accountNumber}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.accountNumber}
                onCopy={() =>
                  handleCopyToClipboard(
                    bankAccountDetails.accountNumber,
                    "Account Number"
                  )
                }
              >
                <IconButton
                  icon={<FaCopy />}
                  size="sm"
                  aria-label="Copy Account Number"
                />
              </CopyToClipboard>
            </Box>

            <Box display={"flex"} justifyContent={"space-between"}>
              <Text>
                <strong>Bank:</strong> {bankAccountDetails.bank}
              </Text>
              <CopyToClipboard
                text={bankAccountDetails.bank}
                onCopy={() =>
                  handleCopyToClipboard(bankAccountDetails.bank, "Bank")
                }
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

        {/* Payment Form Fields */}
        <FormControl id="paymentType" isInvalid={!!formErrors.paymentType}>
          <FormLabel>Mode of Payment</FormLabel>
          <Select
            value={formValues.paymentType}
            onChange={(e) => {
              const value = e.target.value;
              setFormValues((prev) => {
                const updatedValues = { ...prev, paymentType: value };
                handlePaymentAmountChange(value, formValues.campType);
                return updatedValues;
              });
            }}
          >
            <option value="Full Payment">Full Payment</option>
            <option value="Installmental Payment">Installmental Payment</option>
          </Select>
          {formErrors.paymentType && (
            <Text color="red.500" fontSize="sm">
              {formErrors.paymentType}
            </Text>
          )}
        </FormControl>

        <FormControl id="campType" isInvalid={!!formErrors.campType}>
          <FormLabel>What part of the Camp/Conference?</FormLabel>
          <Select
            value={formValues.campType}
            onChange={(e) => {
              const value = e.target.value;
              setFormValues((prev) => {
                const updatedValues = { ...prev, campType: value };
                handlePaymentAmountChange(formValues.paymentType, value);
                return updatedValues;
              });
            }}
          >
            <option value="Camp Only">Camp Only</option>
            <option value="Conference Only">Conference Only</option>
            <option value="Camp and Conference">Camp and Conference</option>
          </Select>
          {formErrors.campType && (
            <Text color="red.500" fontSize="sm">
              {formErrors.campType}
            </Text>
          )}
        </FormControl>

        <FormControl id="amount">
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            value={formValues.amount || minimumAmountRequired}
            readOnly
          />
          {formErrors.amount && (
            <Text color="red.500" fontSize="sm">
              {formErrors.amount}
            </Text>
          )}
        </FormControl>

        <FormControl id="receipt" isInvalid={!!formErrors.receipt}>
          <FormLabel>Upload Payment Receipt</FormLabel>
          <InputGroup>
            <Input
              type="file"
              ref={inputFileRef}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  receipt: e.target.files[0],
                }))
              }
            />
            <InputRightElement>
              <MdAttachFile onClick={() => inputFileRef.current.click()} />
            </InputRightElement>
          </InputGroup>
          {formErrors.receipt && (
            <Text color="red.500" fontSize="sm">
              {formErrors.receipt}
            </Text>
          )}
        </FormControl>

        <FormControl id="paymentNarration">
          <FormLabel>Payment Narration (Optional)</FormLabel>
          <Textarea
            value={formValues.paymentNarration}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                paymentNarration: e.target.value,
              }))
            }
            placeholder="Enter any additional details for this payment"
          />
        </FormControl>

        <Stack direction="row" spacing={4} mt={4}>
          <Button
            type="button"
            colorScheme="gray"
            onClick={onPrevious}
          >
            Back
          </Button>
          <Button
            type="submit"
            isLoading={loading} 
            loadingText="Processing..."
            colorScheme="green"

          >
            Next
          </Button>
        </Stack>
      </Box>
    </form>
  );
};

export default PaymentForm;

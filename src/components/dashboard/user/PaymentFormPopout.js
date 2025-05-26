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
  Text,
  IconButton,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";
import { CopyToClipboard } from "react-copy-to-clipboard";

const PaymentFormPopout = ({
  isOpen,
  onClose,
  role,
  values,
  onValuesChange,
  onNext,
  onPrevious,
  prevFormValues,
  userId,
  refreshUserData,
  balance = 35000,
}) => {
  const [formValues, setFormValues] = useState({
    paymentType: "Full Payment",
    campType: "Conference Only",
    amount: balance?.toString() || "35000",
    receipt: "",
    paymentNarration: "",
  });
  const [minimumAmountRequired, setMinimumAmountRequired] = useState(balance || 35000);
  const [formErrors, setFormErrors] = useState({});
  const [blobDetails, setBlobDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const inputFileRef = useRef(null);
  const toast = useToast();

  const bankAccountDetails = {
    accountName: "Timsan southwest",
    accountNumber: "2283452778",
    bank: "UBA",
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
    if (
      !formValues.amount ||
      parseInt(formValues.amount) < minimumAmountRequired
    )
      validationErrors.amount = `Minimum amount is ₦${minimumAmountRequired}`;
    if (!formValues.receipt)
      validationErrors.receipt = "Receipt upload is required";
    setFormErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const file = inputFileRef.current.files[0];
      if (!file) {
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });
      if (!response.ok) {
        setLoading(false);
        throw new Error("File upload failed");
      }
      const result = await response.json();
      const { url } = result;
      setBlobDetails({ url });
      const paymentRes = await fetch("/api/paymentformpopout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          paymentType: formValues.paymentType,
          amount: formValues.amount,
          receiptUrl: url,
        }),
      });
      if (!paymentRes.ok) {
        setLoading(false);
        throw new Error("Payment update failed");
      }
      if (refreshUserData) refreshUserData();
      toast({
        title: "Success",
        description: "Payment data updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
        setFormValues({
        paymentType: "Full Payment",
        campType: "Conference Only",
        amount: balance?.toString() || "35000",
        receipt: "",
        paymentNarration: "",
      });
      setBlobDetails({});
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file or update payment. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFileClick = () => {
    inputFileRef.current.click();
  };

  const handlePaymentTypeChange = (e) => {
    const paymentType = e.target.value;
    let amount = "";
    let minAmount = 0;
    if (paymentType === "Full Payment") {
      amount = balance?.toString() || "35000";
      minAmount = balance || 35000;
    } else {
      amount = "";
      minAmount = 5000;
    }
    setFormValues((prev) => ({
      ...prev,
      paymentType,
      amount,
    }));
    setMinimumAmountRequired(minAmount);
  };

  const handleAmountChange = (e) => {
    setFormValues((prev) => ({
      ...prev,
      amount: e.target.value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Complete Your Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleFormSubmit}>
            <Box display={"flex"} flexDirection={"column"} gap={6}>
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
              <FormControl id="paymentType" isInvalid={!!formErrors.paymentType}>
                <FormLabel>Mode of Payment</FormLabel>
                <Select
                  value={formValues.paymentType}
                  onChange={handlePaymentTypeChange}
                >
                  <option value="Full Payment">Full Payment</option>
                  <option value="Installmental">Installmental</option>
                </Select>
                {formErrors.paymentType && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.paymentType}
                  </Text>
                )}
              </FormControl>
              <FormControl id="campType" isInvalid={!!formErrors.campType}>
                <FormLabel>What part of the Camp/Conference?</FormLabel>
                <Input value="Conference Only" readOnly />
                {formErrors.campType && (
                  <Text color="red.500" fontSize="sm">
                    {formErrors.campType}
                  </Text>
                )}
              </FormControl>
              <FormControl id="amount" isInvalid={!!formErrors.amount}>
                <FormLabel>Amount</FormLabel>
                {formValues.paymentType === "Full Payment" ? (
                  <Input value={balance?.toString() || "35000"} readOnly />
                ) : (
                  <Select
                    value={formValues.amount}
                    onChange={handleAmountChange}
                  >
                    <option value="">Select Amount</option>
                    <option value="10000">10,000</option>
                    <option value="20000">20,000</option>
                    <option value="5000">5,000</option>
                  </Select>
                )}
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
                    type="text"
                    value={formValues.receipt ? formValues.receipt.name : ""}
                    placeholder="No file chosen"
                    readOnly
                    bg="white"
                    cursor="pointer"
                  />
                  <input
                    type="file"
                    ref={inputFileRef}
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        receipt: e.target.files[0],
                      }))
                    }
                  />
                  <InputRightElement width="auto" pr={2}>
                    <Button
                      leftIcon={<MdAttachFile />}
                      colorScheme="green"
                      size="sm"
                      onClick={handleChooseFileClick}
                      borderRadius="md"
                    >
                      Choose File
                    </Button>
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
              <Stack mt={4}>
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Processing..."
                  colorScheme="green"
                  width="100%"
                >
                  Submit
                </Button>
              </Stack>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentFormPopout;
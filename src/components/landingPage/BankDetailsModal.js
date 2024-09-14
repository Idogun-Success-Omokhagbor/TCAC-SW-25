import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  IconButton,
  Tooltip,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useState } from "react";

const BankDetailsModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const bankDetails = `Bank Name: UBA\nAccount Number: 2283452778\nAccount Name: Timsan southwest`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bankDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bank Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" align="center">
            <Text mb={4}>{bankDetails}</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Tooltip
            label={copied ? "Copied!" : "Copy"}
            aria-label="Copy tooltip"
          >
            <IconButton
              icon={<CopyIcon />}
              onClick={handleCopy}
              aria-label="Copy bank details"
            />
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BankDetailsModal;

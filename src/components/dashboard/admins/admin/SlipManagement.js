import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Input,
  Button,
  Text,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import PaymentSlip from "../../user/PaymentSlip";

const Empty = ({ description }) => (
  <Flex align="center" justify="center" py={10} color="gray.400" fontSize="lg">
    {description}
  </Flex>
);

const SlipManagement = () => {
  const [slips, setSlips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [userPayments, setUserPayments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Added for print slip
  const [showSlip, setShowSlip] = useState(false);
  const [slipCode, setSlipCode] = useState("");
  const slipRef = useRef();

  useEffect(() => {
    const fetchSlips = async () => {
      setLoading(true);
      const res = await fetch("/api/admin/slips");
      const data = await res.json();
      setSlips(data.slips || []);
      setLoading(false);
    };
    fetchSlips();
  }, []);

  const handleSearch = () => {
    if (!search) setFiltered(slips);
    else {
      setFiltered(
        slips.filter((s) => s.slipCode.includes(search))
      );
    }
  };

  useEffect(() => {
    setFiltered(slips);
  }, [slips]);

  const handleViewSlip = async (slip) => {
    setSelectedSlip(slip);
    if (slip.user && slip.user._id) {
      const res = await fetch(`/api/payment/history?userId=${slip.user._id}`);
      const data = await res.json();
      setUserPayments(data.payments || []);
    } else {
      setUserPayments([]);
    }
    setShowSlipModal(true);
  };

  const handleViewReceipt = async (slip) => {
    setSelectedSlip(slip);
    setShowReceiptModal(true);
    if (slip.user && slip.user._id) {
      const res = await fetch(`/api/payment/history?userId=${slip.user._id}`);
      const data = await res.json();
      setUserPayments(data.payments || []);
    } else {
      setUserPayments([]);
    }
  };

  const getUserName = (user) => {
    if (!user) return "N/A";
    const name = `${user.firstName} ${user.lastName}`;
    return name.length > 18 ? name.slice(0, 15) + "..." : name;
  };

  // Print slip logic
  const printSlip = async () => {
    if (!selectedSlip || !selectedSlip.user || !selectedSlip.user._id) return;
    const res = await fetch("/api/slip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedSlip.user._id }),
    });
    const data = await res.json();
    setSlipCode(data.slipCode);
    setShowSlip(true);
  };

  const handlePrint = () => {
    if (!slipRef.current) return;
    const printContents = slipRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=700");
    win.document.write(`<html><head><title>Print Slip</title></head><body>${printContents}</body></html>`);
    Array.from(document.querySelectorAll('style,link[rel="stylesheet"]'))
      .forEach(node => win.document.head.appendChild(node.cloneNode(true)));
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
      win.close();
    };
  };

  return (
    <Box p={6}>
      <Heading size="md" mb={4}>
        Slip Management
      </Heading>
      <Flex mb={4} maxW="300px">
        <Input
          placeholder="Search by slip code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
        />
        <IconButton
          aria-label="Search"
          icon={<SearchIcon />}
          ml={2}
          onClick={handleSearch}
        />
      </Flex>
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Empty description="No data" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Slip Code</Th>
              <Th>User</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filtered.map((slip) => (
              <Tr key={slip._id}>
                <Td>
                  <Text fontFamily="mono">{slip.slipCode}</Text>
                </Td>
                <Td>
                  {getUserName(slip.user)}
                </Td>
                <Td>
                  {slip.date ? new Date(slip.date).toLocaleString() : ""}
                </Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleViewSlip(slip)}
                  >
                    View Slip
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => handleViewReceipt(slip)}
                  >
                    View Receipt
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={showSlipModal} onClose={() => setShowSlipModal(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Slip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSlip && (
              <Box>
                <Box ref={slipRef}>
                  <PaymentSlip
                    user={selectedSlip.user}
                    payments={userPayments}
                    slipCode={selectedSlip.slipCode}
                  />
                </Box>
                <Flex mt={4} justify="center" gap={2}>
                  <Button
                    colorScheme="blue"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Receipts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {userPayments.length === 0 ? (
              <Text>No payments found for this user.</Text>
            ) : (
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Amount</Th>
                    <Th>Type</Th>
                    <Th>Camp Type</Th>
                    <Th>Status</Th>
                    <Th>Receipt</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userPayments.map((payment) => (
                    <Tr key={payment._id}>
                      <Td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}</Td>
                      <Td>₦{payment.amount ? Number(payment.amount).toLocaleString() : "-"}</Td>
                      <Td>{payment.paymentType}</Td>
                      <Td>{payment.campType || "-"}</Td>
                      <Td>{payment.status}</Td>
                      <Td>
                        {payment.receiptUrl ? (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            as="a"
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </Button>
                        ) : (
                          "-"
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SlipManagement;
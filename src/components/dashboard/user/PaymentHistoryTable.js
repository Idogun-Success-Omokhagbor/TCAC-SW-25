import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Link,
  Badge,
} from "@chakra-ui/react";

const statusColor = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
};

const PaymentHistoryTable = ({ paymentHistory = [] }) => {
  return (
    <Box
      bg="white"
      borderRadius="md"
      boxShadow="md"
      p={6}
      mb={8}
      maxW="900px"
      mx="auto"
      border="1px solid #e2e8f0"
    >
      <Text fontWeight="bold" fontSize="xl" mb={4}>
        Payment History
      </Text>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Receipt</Th>
            <Th>Status</Th>
            <Th>Admin Comment</Th>
          </Tr>
        </Thead>
        <Tbody>
          {paymentHistory.length === 0 ? (
            <Tr>
              <Td colSpan={5}>
                <Text textAlign="center" color="gray.500">
                  No payment history yet.
                </Text>
              </Td>
            </Tr>
          ) : (
            paymentHistory.map((item, idx) => (
              <Tr key={item._id || idx}>
                <Td>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "-"}
                </Td>
                <Td>
                  ₦{item.amount ? Number(item.amount).toLocaleString() : "-"}
                </Td>
                <Td>
                  {item.receiptUrl ? (
                    <Link
                      href={item.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="blue.500"
                      textDecoration="underline"
                    >
                      View
                    </Link>
                  ) : (
                    "-"
                  )}
                </Td>
                <Td>
                  <Badge colorScheme={statusColor[item.status] || "gray"}>
                    {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "-"}
                  </Badge>
                </Td>
                <Td>
                  {item.adminComment || "-"}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PaymentHistoryTable;
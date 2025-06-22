import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Flex,
  useToast,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuList,
  Text,
  Center,
} from "@chakra-ui/react";
import { FaSearch, FaDownload, FaSync } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Empty } from "antd";
import "antd/dist/reset.css";
import {
  fetchAdmins,
  approveAdmin,
  rejectAdmin,
  selectAdmins,
  selectLoading,
  selectError,
  selectAdminById,
} from "../../../store/slices/adminActionsSlice";
import * as XLSX from "xlsx";

const RegisteredAdmins = () => {
  const dispatch = useDispatch();
  const admins = useSelector(selectAdmins) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newAdminFunction, setNewAdminFunction] = useState(null);

  const toast = useToast();

  const adminsPerPage = 10; // Number of admins to show per page
  const pageCount = Math.ceil(admins.length / adminsPerPage); // Calculate total pages

  useEffect(() => {
    console.log("Fetching admins...");
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleViewMore = (admin) => {
    setSelectedAdmin(admin);
    onOpen();
  };

  const handleApprove = async (id) => {
    try {
      console.log("Approving admin with ID:", id);
      await dispatch(approveAdmin(id)).unwrap();
      toast({
        title: "Success",
        description: "Admin approved successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Approval error:", error);
    }
    onClose();
  };

  const handleReject = async (id) => {
    try {
      console.log("Rejecting admin with ID:", id);
      await dispatch(rejectAdmin(id)).unwrap();
      toast({
        title: "Success",
        description: "Admin rejected successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log("Rejection error:", error);
    }
    onClose();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleExportToExcel = () => {
    // console.log("Exporting to Excel...");

    // Define keys to exclude
    const excludedKeys = ["_id", "password", "__v", "updatedAt"];

    // Filter and map admin data
    const filteredAdmins = admins.map((admin) => {
      return Object.entries(admin)
        .filter(([key, value]) => !excludedKeys.includes(key) && value) // Exclude specified keys and ensure values are not empty
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    });

    // Create a worksheet from the filtered user data
    const worksheet = XLSX.utils.json_to_sheet(filteredAdmins);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");

    // Export the file
    XLSX.writeFile(workbook, "admins_data.xlsx");
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "next" && prev < pageCount - 1) return prev + 1;
      if (direction === "prev" && prev > 0) return prev - 1;
      return prev;
    });
  };

  const handleUpdateTable = () => {
    console.log("Updating table...");
    dispatch(fetchAdmins());
  };

  const handleUpdateAdminFunction = (newFunction) => {
    setNewAdminFunction(newFunction);
    setIsUpdateModalOpen(true);
  };

  const confirmUpdateAdminFunction = async () => {
    if (selectedAdmin && newAdminFunction) {
      try {
        console.log("Updating admin function...");
        const response = await fetch(
          `/api/admin-actions/${selectedAdmin._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "updateFunction",
              adminFunction: newAdminFunction,
            }),
          }
        );
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Success",
            description: "Admin function updated successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          dispatch(fetchAdmins()); // Refresh the list
          onClose(); // Close the modal
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
    setIsUpdateModalOpen(false);
  };

  // Filtered admins based on search term
  const filteredAdmins = admins.filter(
    (admin) => {
      if (!admin) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const firstName = admin.firstName ? admin.firstName.toLowerCase() : '';
      const lastName = admin.lastName ? admin.lastName.toLowerCase() : '';
      const fullName = `${firstName} ${lastName}`.trim();
      const fullNameReversed = `${lastName} ${firstName}`.trim();
      
      return (
        firstName.includes(searchLower) ||
        lastName.includes(searchLower) ||
        fullName.includes(searchLower) ||
        fullNameReversed.includes(searchLower) ||
        (admin.email && admin.email.toLowerCase().includes(searchLower)) ||
        (admin.adminFunction && admin.adminFunction.toLowerCase().includes(searchLower)) ||
        (admin.adminID && admin.adminID.toLowerCase().includes(searchLower))
      );
    }
  );

  // Admins to display on the current page
  const currentAdmins = filteredAdmins.slice(
    currentPage * adminsPerPage,
    (currentPage + 1) * adminsPerPage
  );

  return (
    <Box>
      {/* search, update and download component */}
      <Flex mb={8} justify="space-between" align="center">
        {/* search input */}
        <Flex align="center">
          <Input
            placeholder="Search admins..."
            value={searchTerm}
            onChange={handleSearch}
            size="sm"
            width="200px"
          />
        </Flex>

        {/* update and download buttons */}
        <Flex align="center" gap={4}>
          <Button
            size="sm"
            leftIcon={<FaSync />}
            ml={2}
            onClick={handleUpdateTable}
          >
            Update Table
          </Button>

          <Button
            size="sm"
            leftIcon={<FaDownload />}
            onClick={handleExportToExcel}
          >
            Download
          </Button>
        </Flex>
      </Flex>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Function</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr>
                <Td colSpan={6}>
                  <Center>
                    <Text>Loading...</Text>
                  </Center>
                </Td>
              </Tr>
            ) : currentAdmins.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Center>
                    <Empty 
                      description={
                        <span style={{ color: "#A0AEC0", fontWeight: 600 }}>
                          {searchTerm ? `No admins found for "${searchTerm}"` : "No data"}
                        </span>
                      }
                    />
                  </Center>
                </Td>
              </Tr>
            ) : (
              currentAdmins.map((admin, index) => (
                <Tr key={admin._id}>
                  <Td>{index + 1 + currentPage * adminsPerPage}</Td>
                  <Td>{admin.firstName}</Td>
                  <Td>{admin.lastName}</Td>
                  <Td>{admin.email}</Td>
                  <Td>{admin.adminFunction}</Td>
                  <Td>
                    <Button size="sm" onClick={() => handleViewMore(admin)}>
                      View More
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Flex mt={8} justify="center" align="center">
        <Button
          onClick={() => handlePageChange("prev")}
          isDisabled={currentPage === 0}
          leftIcon={<IoIosArrowBack />}
        >
          Previous
        </Button>
        <Box mx={4}>
          Page {currentPage + 1} of {pageCount}
        </Box>
        <Button
          onClick={() => handlePageChange("next")}
          isDisabled={currentPage === pageCount - 1}
          rightIcon={<IoIosArrowForward />}
        >
          Next
        </Button>
      </Flex>

      {/* View More Modal */}
      {selectedAdmin && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Admin Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {(() => {
                const excludedKeys = ["_id", "password", "updatedAt", "__v"]; // Define excluded keys here

                return (
                  <Flex direction="column" gap={4}>
                    {Object.entries(selectedAdmin)
                      .filter(
                        ([key, value]) => !excludedKeys.includes(key) && value
                      ) // Filter out excluded keys and empty/null values
                      .map(([key, value]) => (
                        <Flex key={key} align="center">
                          <Text fontWeight="bold" mr={2}>
                            {key

                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                            :
                          </Text>
                          {key === "receiptUrl" ? (
                            <Link
                              as={NextLink}
                              href={value}
                              isExternal
                              color="blue.500"
                              textDecoration="underline"
                            >
                              View Receipt
                            </Link>
                          ) : (
                            <Text>{value}</Text>
                          )}
                        </Flex>
                      ))}
                  </Flex>
                );
              })()}
            </ModalBody>
            <ModalFooter>
              <Flex align={"center"} justifyContent={"space-between"} gap={8}>
                {/* update admin function button */}
                <Menu>
                  <MenuButton as={Button} colorScheme="green">
                    Update
                  </MenuButton>
                  <MenuList>
                    {["admin", "reg_team_lead", "health_team_lead"].map(
                      (func) => (
                        <MenuItem
                          key={func}
                          onClick={() => handleUpdateAdminFunction(func)}
                        >
                          {func}
                        </MenuItem>
                      )
                    )}
                  </MenuList>
                </Menu>

                {/* approve and reject button */}
                {/* <Flex align={"center"} gap={4}> */}
                  {/* approve button */}
                  <Button
                    colorScheme="green"
                    onClick={() => handleApprove(selectedAdmin._id)}
                    isDisabled={selectedAdmin.registrationStatus === "approved"}
                  >
                    Approve
                  </Button>

                  {/* reject button */}
                  <Button
                    colorScheme="red"
                    onClick={() => handleReject(selectedAdmin._id)}
                    isDisabled={selectedAdmin.registrationStatus === "rejected"}
                  >
                    Reject
                  </Button>
                {/* </Flex> */}
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Update Admin Function Confirmation Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Admin Function Update</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>
              Are you sure you want to update the admin function to &quot;
              {newAdminFunction}&quot;?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={confirmUpdateAdminFunction}
            >
              Yes
            </Button>
            <Button
              colorScheme="red"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisteredAdmins;

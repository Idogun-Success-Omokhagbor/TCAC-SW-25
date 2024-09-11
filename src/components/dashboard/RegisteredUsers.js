import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import { FaFilter, FaSearch, FaDownload } from "react-icons/fa";
import {
  fetchUsers,
  approveUser,
  rejectUser,
  selectUsers,
  selectLoading,
} from "../../store/slices/userActionsSlice";
import * as XLSX from "xlsx";

const RegisteredUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectLoading);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Use page number starting from 0 for ReactPaginate
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 10; // Number of users to show per page
  const pageCount = Math.ceil(users.length / usersPerPage); // Calculate total pages

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleViewMore = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleApprove = (id) => {
    dispatch(approveUser(id));
    onClose();
  };

  const handleReject = (id) => {
    dispatch(rejectUser(id));
    onClose();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_data.xlsx");
  };

  // Handle page change for ReactPaginate
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Users to display on the current page
  const currentUsers = filteredUsers.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  return (
    <Box>
      <Flex mb={4} justify="space-between" align="center">
        <Box>
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            size="sm"
            width="200px"
            icon={<FaSearch />}
          />
          <Button size="sm" leftIcon={<FaFilter />} ml={2}>
            Filter
          </Button>
        </Box>
        <Button
          size="sm"
          leftIcon={<FaDownload />}
          onClick={handleExportToExcel}
        >
          Download
        </Button>
      </Flex>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              <Th>Email</Th>
              <Th>Category</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentUsers.map((user, index) => (
              <Tr key={user._id}>
                <Td>{index + 1 + currentPage * usersPerPage}</Td>
                <Td>{user.firstname}</Td>
                <Td>{user.lastname}</Td>
                <Td>{user.email}</Td>
                <Td>{user.userCategory}</Td>
                <Td>
                  <Button size="sm" onClick={() => handleViewMore(user)}>
                    View More
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination using ReactPaginate */}
      <Flex mt={4} justify="center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          breakClassName={"break-me"}
          previousClassName={"prev-button"}
          nextClassName={"next-button"}
          disabledClassName={"disabled-button"}
        />
      </Flex>

      {/* Modal */}
      {selectedUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>
                <strong>Name:</strong> {selectedUser.firstname}{" "}
                {selectedUser.lastname}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Category:</strong> {selectedUser.userCategory}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={() => handleApprove(selectedUser._id)}
              >
                Approve
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleReject(selectedUser._id)}
              >
                Reject
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default RegisteredUsers;

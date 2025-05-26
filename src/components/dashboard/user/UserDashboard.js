import React, { useState, useEffect } from "react";
import { Box, Heading, Text, SimpleGrid, Select, Flex, Button } from "@chakra-ui/react";
import { Empty } from "antd";
import "antd/dist/reset.css";
import PaymentFormPopout from "./PaymentFormPopout";
import PaymentHistoryTable from "./PaymentHistoryTable";
import { useDisclosure } from "@chakra-ui/react";

const mealTypes = [
  { label: "Breakfast", value: "breakfast", color: "#b6eabf" },
  { label: "Lunch", value: "afternoon", color: "#f6ffb3" },
  { label: "Dinner", value: "evening", color: "#e6efe3" },
];

const ITEMS_PER_PAGE = 5;

const UserDashboard = ({ accountData: initialData }) => {
  const [accountData, setAccountData] = useState(initialData);
  const [days, setDays] = useState([]);
  const [selectedMealDay, setSelectedMealDay] = useState("");
  const [selectedScheduleDay, setSelectedScheduleDay] = useState("");
  const [meals, setMeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refreshUserData = async () => {
    if (!initialData?._id) return;
    const res = await fetch(`/api/user/${initialData._id}`);
    if (!res.ok) return;
    const data = await res.json();
    setAccountData(data);
    fetchPaymentHistory(data._id);
  };

  const fetchPaymentHistory = async (userId) => {
    if (!userId) return;
    const res = await fetch(`/api/paymenthistory?userId=${userId}`);
    if (!res.ok) {
      setPaymentHistory([]);
      return;
    }
    const data = await res.json();
    setPaymentHistory(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetch("/api/days")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setDays(data.data);
          if (data.data.length > 0) {
            setSelectedMealDay(data.data[0].name);
            setSelectedScheduleDay(data.data[0].name);
          }
        } else {
          setDays([]);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/meal")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setMeals(data) : setMeals([]));
  }, []);

  useEffect(() => {
    fetch("/api/activities")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setActivities(data.data);
        } else {
          setActivities([]);
        }
      });
  }, []);

  useEffect(() => {
    if (accountData?._id) {
      fetchPaymentHistory(accountData._id);
    }
  }, [accountData?._id]);

  const getMealName = type => {
    const meal = meals.find(m => m.day === selectedMealDay && m.type === type);
    return meal && meal.name ? meal.name : "-";
  };

  const filteredActivities = activities
    .filter(a => a.day === selectedScheduleDay)
    .sort((a, b) => (a.startTime < b.startTime ? -1 : a.startTime > b.startTime ? 1 : 0));

  const totalPages = Math.ceil(paymentHistory.length / ITEMS_PER_PAGE);
  const paginatedPayments = paymentHistory.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box bg="#e6efe3" minH="100vh" p={8}>
      <Heading
        fontSize={{ base: "md", md: "lg", lg: "xl", xl: "3xl" }}
        mb={2}
        fontWeight="hairline"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        Welcome back to TCAC ‘24,{" "}
        <Box
          as="span"
          fontWeight="extrabold"
          fontSize={{ base: "lg", md: "xl", lg: "2xl", xl: "3xl" }}
          letterSpacing="wide"
          display="inline"
        >
          {accountData?.firstName || accountData?.userID}!
        </Box>
      </Heading>

      {accountData?.balance > 0 && (
        <Flex
          align="center"
          alignItems="center"
          bg="#32b432"
          borderRadius="md"
          border="3px solid #000"
          p={2}
          mb={10}
          mt={10}
          maxW="900px"
          minW="320px"
          justify="space-between"
          boxShadow="4px 4px 0 #000"
          width="100%"
        >
          <Text fontSize="lg" color="#222" display="flex" alignItems="center">
            You are{" "}
            <Box
              as="span"
              fontWeight="bold"
              display="inline"
              fontSize="xl"
              ml={1}
              mr={1}
              verticalAlign="middle"
            >
              {accountData?.balance?.toLocaleString()} NGN
            </Box>
            away from completing your TCAC payment
          </Text>
          <Box
            as="button"
            bg="#eaffe0"
            color="#222"
            fontWeight="bold"
            fontSize="lg"
            px={7}
            py={2}
            borderRadius="xl"
            border="2px solid #222"
            ml={4}
            boxShadow="2px 2px 0 #222"
            _hover={{ bg: "#d6f5c2", color: "#222" }}
            onClick={onOpen}
          >
            Balance payment
          </Box>
        </Flex>
      )}

      <Box mb={4}>
        <PaymentHistoryTable paymentHistory={paginatedPayments} />
        {paymentHistory.length > ITEMS_PER_PAGE && (
          <Flex justify="center" align="center" mt={2} gap={2}>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
            >
              {"<"}
            </Button>
            <Text fontSize="md">
              {page} / {totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
            >
              {">"}
            </Button>
          </Flex>
        )}
      </Box>

      <Text fontSize="xl" mb={8}>
        We are not just a camp, we are family.
      </Text>

      <Flex
        align="center"
        bg="#eaffad"
        borderRadius="lg"
        px={8}
        py={5}
        mb={8}
        maxW="600px"
        boxShadow="lg"
        border="1px solid #eaffad"
        justify="space-between"
        gap={4}
      >
        <Box>
          <Text fontWeight="bold" fontSize="2xl" color="#222">
            Meal Schedule
          </Text>
          <Text fontSize="md" color="gray.600" mt={1}>
            Select a day to view the schedule
          </Text>
        </Box>
        <Select
          value={selectedMealDay}
          onChange={e => setSelectedMealDay(e.target.value)}
          width="auto"
          fontSize="lg"
          bg="#eaffe0"
          borderColor="#b6eabf"
          borderRadius="md"
          minW="150px"
        >
          {days.map(day => (
            <option key={day._id} value={day.name}>
              {day.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Box
        bg="#eaffe0"
        border="1px solid #000"
        p={8}
        borderRadius="md"
        maxW="900px"
        mb={8}
      >
        <SimpleGrid columns={3} spacing={10}>
          {mealTypes.map(mt => (
            <Box textAlign="center" key={mt.value}>
              <Box
                bg={mt.color}
                color="#222"
                fontWeight="bold"
                fontSize="xl"
                px={8}
                py={2}
                borderRadius="md"
                mb={6}
                display="inline-block"
                border="1px solid #000"
              >
                {mt.label}
              </Box>
              <Text fontSize="2xl" mt={4}>
                {getMealName(mt.value)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
      <Box height={8} />
      <Flex
        align="center"
        bg="#32b432"
        borderRadius="lg"
        px={8}
        py={5}
        mb={8}
        maxW="600px"
        boxShadow="lg"
        border="1px solid #eaffad"
        justify="space-between"
        gap={4}
      >
        <Box>
          <Text fontWeight="bold" fontSize="2xl" color="#222">
            Daily Schedule
          </Text>
          <Text fontSize="md" color="gray.600" mt={1}>
            Select a day to view the schedule
          </Text>
        </Box>
        <Select
          value={selectedScheduleDay}
          onChange={e => setSelectedScheduleDay(e.target.value)}
          width="auto"
          fontSize="lg"
          bg="#eaffe0"
          borderColor="#b6eabf"
          borderRadius="md"
          minW="150px"
        >
          {days.map(day => (
            <option key={day._id} value={day.name}>
              {day.name}
            </option>
          ))}
        </Select>
      </Flex>
      <Box
        bg="#f1ffb3"
        border="1px solid #000"
        p={8}
        borderRadius="md"
        maxW="1100px"
        mx="auto"
        mb={8}
        mt={4}
      >
        <SimpleGrid columns={3} spacing={10}>
          <Box textAlign="center">
            <Box
              bg="#e6efe3"
              color="#222"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
            >
              Activities
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} />
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id}>
                  {item.name}
                </Text>
              ))
            )}
          </Box>
          <Box textAlign="center">
            <Box
              bg="#eaffe0"
              color="#222"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
            >
              Duration
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} display="flex" alignItems="center" justifyContent="center" height="100%">
                <Empty description="No data" />
              </Box>
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id}>
                  {item.startTime} - {item.endTime}
                </Text>
              ))
            )}
          </Box>
          <Box textAlign="center">
            <Box
              bg="#3cb43c"
              color="#fff"
              fontWeight="bold"
              fontSize="xl"
              px={8}
              py={2}
              borderRadius="md"
              mb={6}
              display="inline-block"
              border="1px solid #000"
            >
              Facilitator
            </Box>
            {filteredActivities.length === 0 ? (
              <Box py={12} />
            ) : (
              filteredActivities.map(item => (
                <Text fontSize="xl" mt={8} key={item._id}>
                  {item.facilitator}
                </Text>
              ))
            )}
          </Box>
        </SimpleGrid>
      </Box>
      <PaymentFormPopout
        isOpen={isOpen}
        onClose={onClose}
        userId={accountData?._id}
        balance={accountData?.balance}
        refreshUserData={refreshUserData}
      />
    </Box>
  );
};

export default UserDashboard;
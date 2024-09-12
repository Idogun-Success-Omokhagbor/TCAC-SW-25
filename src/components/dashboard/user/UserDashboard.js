import React from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import MealSchedule from "../MealSchedule";
import DailySchedule from "../DailySchedule";

const UserDashboard = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={4} p={4} bg="white"  borderRadius="md" boxShadow="md">
      <MealSchedule />
      <DailySchedule />
    </Box>
  );
};

export default UserDashboard;

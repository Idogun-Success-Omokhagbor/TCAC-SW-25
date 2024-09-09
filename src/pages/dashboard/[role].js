import React, { useState } from 'react';
import { useRouter } from "next/router";
import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import MealSchedule from '../../components/dashboard/MealSchedule';
import DailySchedule from '../../components/dashboard/DailySchedule';

const DashboardPage = () => {
  const router = useRouter();
  const { role = "user" } = router.query;

  const [selectedComponent, setSelectedComponent] = useState('meal-schedule');

  const handleMenuClick = (menu) => {
    console.log(`Menu clicked: ${menu}`);
    setSelectedComponent(menu);
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'meal-schedule':
        return <MealSchedule />;
      case 'daily-schedule':
        return <DailySchedule />;
      // Add cases for other components as needed
      default:
        return <MealSchedule />;
    }
  };

  return (
    <DashboardLayout onMenuClick={handleMenuClick}  role={role}>
      {renderComponent()}
    </DashboardLayout>
  );
};

export default DashboardPage;

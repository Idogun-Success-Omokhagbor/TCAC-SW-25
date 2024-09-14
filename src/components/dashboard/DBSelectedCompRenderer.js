import React from "react";
import UserDashboard from "./user/UserDashboard";
import MealSchedule from "./MealSchedule";
import DailySchedule from "./DailySchedule";
import PaymentHistory from "./paymentHistory";

import RegisteredAdmins from "./superAdmin/RegisteredAdmins";
import RegisteredUsers from "./RegisteredUsers";

import RegTeamComponent from "./RegTeamComp";
import HealthTeamComponent from "./HealthTeamComp";

const DashboardSelectedComponentRenderer = ({
  role,
  accountData,
  adminFunction,
  selectedComponent,
}) => {
  const renderComponent = () => {
    if (role === "User") {
      switch (selectedComponent) {
        case "dashboard":
          return <UserDashboard />;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <UserDashboard />;
      }
    }

    if (role === "Admin") {
      switch (adminFunction) {
        case "reg_team_lead":
          return (
            <>
              {selectedComponent === "registered-users" ? (
                <RegisteredUsers />
              ) : selectedComponent === "meal-schedule" ? (
                <MealSchedule />
              ) : (
                <>
                  <RegisteredUsers />
                </>
              )}
            </>
          );
          
        case "health_team_lead":
          return (
            <>
             { selectedComponent === "meal-schedule" ? (
                <MealSchedule />
              ) : selectedComponent === "daily-schedule" ? (
                <DailySchedule />
              ) : (
             
                  <DailySchedule />
               
              )}
            </>
          );
  
        case "admin":
          return (
            <>
              {selectedComponent === "registered-users" ? (
                <RegisteredUsers />
              ) : selectedComponent === "daily-schedule" ? (
                <DailySchedule />
              ) : (
               
                     <RegisteredUsers />
               
              )}
            </>
          );
  
        default:
          return <RegisteredUsers />;
      }
    }

    if (role === "Super Admin") {
      switch (selectedComponent) {
        case "registered-users":
          return <RegisteredUsers />;
          case "registered-admins":
            return <RegisteredAdmins />;
        default:
          return <RegisteredUsers />;
      }
    }
  };

  return <>{renderComponent()}</>;
};

export default DashboardSelectedComponentRenderer;

import React from "react";
import UserDashboard from "./user/UserDashboard";
import MealSchedule from "./MealSchedule";
import DailySchedule from "./DailySchedule";
import PaymentHistory from "./paymentHistory";
import RegisteredAdmins from "./superAdmin/RegisteredAdmins";
import RegisteredUsers from "./RegisteredUsers";
import RegTeamComponent from "./RegTeamComp";
import HealthTeamComponent from "./HealthTeamComp";
import MealManagement from "./admins/admin/MealManagement";

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
          return <UserDashboard accountData={accountData}/>;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <UserDashboard accountData={accountData}/>;
      }
    }

    if (role === "Admin") {
      switch (adminFunction) {
        case "reg_team_lead":
          return (
            <>
              {selectedComponent === "registered-users" ? (
                <RegisteredUsers accountData={accountData}/>
              ) : selectedComponent === "meal-schedule" ? (
                <MealSchedule />
              ) : (
                <RegisteredUsers accountData={accountData}/>
              )}
            </>
          );
        case "health_team_lead":
          return (
            <>
              {selectedComponent === "meal-schedule" ? (
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
                <RegisteredUsers accountData={accountData}/>
              ) : selectedComponent === "daily-schedule" ? (
                <DailySchedule />
              ) : selectedComponent === "meal-management" ? (
                <MealManagement />
              ) : (
                <RegisteredUsers accountData={accountData}/>
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
          return <RegisteredUsers accountData={accountData}/>;
        case "registered-admins":
          return <RegisteredAdmins accountData={accountData}/>;
        default:
          return <RegisteredUsers accountData={accountData}/>;
      }
    }
  };

  return <>{renderComponent()}</>;
};

export default DashboardSelectedComponentRenderer;
import React from "react";
import UserDashboard from "./user/UserDashboard";
import MealSchedule from "./MealSchedule";
import DailySchedule from "./DailySchedule";
import PaymentHistory from "./paymentHistory";
import RegisteredUsers from "./RegisteredUsers";
import RegTeamComponent from "./RegTeamComp";
import HealthTeamComponent from "./HealthTeamComp";

const DashboardSelectedComponentRenderer = ({ role, adminFunction, selectedComponent }) => {
  const renderComponent = () => {
    if (role === "user") {
      switch (selectedComponent) {
        case "dashboard":
          return <UserDashboard />;
        case "meal-schedule":
          return <MealSchedule />;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <DailySchedule />;
      }
    }

    if (role === "admin") {
      switch (adminFunction) {
        case "reg_team_lead":
          return selectedComponent === "reg-team" ? <RegTeamComponent /> : <RegisteredUsers />;
        case "health_team_lead":
          return selectedComponent === "health-team" ? <HealthTeamComponent /> : <MealSchedule />;
        default:
          return <RegisteredUsers />;
      }
    }

    if (role === "super_admin") {
      switch (selectedComponent) {
        case "meal-schedule":
          return <MealSchedule />;
        default:
          return <RegisteredUsers />;
      }
    }
  };

  return <>{renderComponent()}</>;
};

export default DashboardSelectedComponentRenderer;

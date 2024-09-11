import React from "react";
import MealSchedule from "./MealSchedule";
import DailySchedule from "./DailySchedule";
import PaymentHistory from "./paymentHistory";
import RegisteredUsers from "./RegisteredUsers";
import RegTeamComponent from "./RegTeamComp";
import HealthTeamComponent from "./HealthTeamComp";

const DashboardSelectedComponentRenderer = ({
  role,
  adminFunction,
  selectedComponent,
}) => {
  // Function to render the correct component based on role and selection
  const renderComponent = () => {
    if (role === "user") {
      // User-specific components
      switch (selectedComponent) {
        case "meal-schedule":
          return <MealSchedule />;
        case "daily-schedule":
          return <DailySchedule />;
        case "payment-history":
          return <PaymentHistory />;
        default:
          return <DailySchedule />;
      }
    } else if (role === "admin") {
      // Admin-specific components, differentiating by adminFunction
      switch (adminFunction) {
        case "reg_team_lead":
          // Default to RegisteredUsers for reg_team_lead if no valid selection is made
          return (
            <>
              {selectedComponent === "registered-users" && <RegisteredUsers />}
              {selectedComponent === "reg-team" && <RegTeamComponent />}
              {/* Default component */}
              {!selectedComponent || selectedComponent === "" ? (
                <RegisteredUsers />
              ) : null}
            </>
          );
        case "health_team_lead":
          // Multiple components for health_team_lead
          return (
            <>
              {selectedComponent === "health-team" && <HealthTeamComponent />}
              {selectedComponent === "meal-schedule" && <MealSchedule />}
              {/* Default component */}
              {!selectedComponent || selectedComponent === "" ? (
                <MealSchedule />
              ) : null}
            </>
          );
        case "admin":
        default:
          return (
            <>
              {selectedComponent === "registered-users" && <RegisteredUsers />}
              {selectedComponent === "meal-schedule" && <MealSchedule />}
              {/* Default component */}
              {!selectedComponent || selectedComponent === "" ? (
                <RegisteredUsers />
              ) : null}
            </>
          );
      }
    } else if (role === "super_admin") {
      // Super admin-specific components
      switch (selectedComponent) {
        case "registered-users":
          return <RegisteredUsers />;
        case "meal-schedule":
          return <MealSchedule />;
        default:
          // Default to RegisteredUsers if no valid selection is made
          return <RegisteredUsers />;
      }
    }
  };

  return <>{renderComponent()}</>;
};

export default DashboardSelectedComponentRenderer;

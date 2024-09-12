import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import UserSidebar from '../../components/dashboard/user/UserSidebar';
import AdminSidebar from '../../components/dashboard/admins/admin/AdminSidebar';
import SuperAdminSidebar from '../../components/dashboard/superAdmin/SuperAdminSidebar';
import RegTeamSidebar from '../../components/dashboard/admins/regTeamLead/RegTeamSidebar';
import HealthTeamSidebar from '../../components/dashboard/admins/healthTeamLead/HealthTeamSidebar';
import UserHeader from '../../components/dashboard/user/UserHeader';
import AdminHeader from '../../components/dashboard/admins/admin/AdminHeader';
import SuperAdminHeader from '../../components/dashboard/superAdmin/SuperAdminHeader';
import RegTeamHeader from '../../components/dashboard/admins/regTeamLead/RegTeamHeader';
import HealthTeamHeader from '../../components/dashboard/admins/healthTeamLead/HealthTeamHeader';

import DashboardSelectedComponentRenderer from '@/components/dashboard/SelectedComponentRenderer';

const DashboardLayout = ({ role, adminFunction, }) => {
  const [selectedComponent, setSelectedComponent] = useState("daily-schedule");

  const handleMenuClick = (component) => setSelectedComponent(component);

  const renderHeader = () => {
    if (role === 'user') return <UserHeader />;
    if (role === 'super_admin') return <SuperAdminHeader />;
    switch (adminFunction) {
      case 'reg_team_lead':
        return <RegTeamHeader />;
      case 'health_team_lead':
        return <HealthTeamHeader />;
      default:
        return <AdminHeader />;
    }
  };

  const renderSidebar = () => {
    if (role === 'user') return <UserSidebar onMenuClick={handleMenuClick} />;
    if (role === 'super_admin') return <SuperAdminSidebar onMenuClick={handleMenuClick} />;
    switch (adminFunction) {
      case 'reg_team_lead':
        return <RegTeamSidebar onMenuClick={handleMenuClick} />;
      case 'health_team_lead':
        return <HealthTeamSidebar onMenuClick={handleMenuClick} />;
      default:
        return <AdminSidebar onMenuClick={handleMenuClick} />;
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {renderSidebar()}
      <Box flex="1" p={{base: "4",  md: "8"}} bg="white">
        {renderHeader()}
        <Box p={{base: "4",  md: "8"}}>
          {/* Render the selected component */}
          <DashboardSelectedComponentRenderer
            role={role}
            adminFunction={adminFunction}
            selectedComponent={selectedComponent}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;

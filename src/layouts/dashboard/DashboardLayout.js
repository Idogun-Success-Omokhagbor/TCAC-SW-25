import { Box, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
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

const MotionBox = motion(Box);

const DashboardLayout = ({ role, adminFunction, children, onMenuClick }) => {
  // Dynamically render header based on role and admin function
  const renderHeader = () => {
    if (role === 'user') return <UserHeader />;
    if (role === 'super_admin') return <SuperAdminHeader />;

    // Admin-specific headers
    switch (adminFunction) {
      case 'reg_team_lead':
        return <RegTeamHeader />;
      case 'health_team_lead':
        return <HealthTeamHeader />;
      case 'admin':
      default:
        return <AdminHeader />;
    }
  };

  // Dynamically render sidebar based on role and admin function
  const renderSidebar = () => {
    if (role === 'user') return <UserSidebar onMenuClick={onMenuClick} />;
    if (role === 'super_admin') return <SuperAdminSidebar onMenuClick={onMenuClick} />;
    
    // Admin-specific sidebars
    switch (adminFunction) {
      case 'reg_team_lead':
        return <RegTeamSidebar onMenuClick={onMenuClick} />;
      case 'health_team_lead':
        return <HealthTeamSidebar onMenuClick={onMenuClick} />;
      case 'admin':
      default:
        return <AdminSidebar onMenuClick={onMenuClick} />;
    }
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      {renderSidebar()}
      <MotionBox
        as="main"
        flex="1"
        p="8"
        bg="white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderHeader()}
        <Box p={8}>{children}</Box>
      </MotionBox>
    </Flex>
  );
};

export default DashboardLayout;

import React, { useEffect, useMemo } from "react"; // React and hooks (useEffect, useMemo) for functional component and optimization
import { useRouter } from "next/router"; // Hook to access Next.js router
import { useSelector, useDispatch } from "react-redux"; // Hooks to access Redux store state and dispatch actions
import { useToast } from "@chakra-ui/react"; // Hook for displaying toast notifications
import DashboardLayout from "../../../layouts/dashboard/DashboardLayout"; // Component for dashboard layout
import {
  selectIsUserAuthenticated,
  selectUserToken,
  selectUser,
  logoutUser,
} from "../../../store/slices/auth/user/userAuthSlice"; // User authentication selectors and actions
import {
  selectIsAdminAuthenticated,
  selectAdminToken,
  selectAdmin,
  logoutAdmin,
} from "../../../store/slices/auth/admin/adminAuthSlice"; // Admin authentication selectors and actions
import {
  selectIsSuperAdminAuthenticated,
  selectSuperAdminToken,
  selectSuperAdmin,
  logoutSuperAdmin,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice"; // Super admin authentication selectors and actions

const DashboardPage = () => {
  const router = useRouter(); // Access the router object for navigation

  const { role } = router.query; // Extract 'role' query parameter from URL
  // console.log("role:", role)

  const toast = useToast(); // Function to display toast notifications
  
  const dispatch = useDispatch(); // Access the dispatch function for Redux actions

  // Memoize the selectors based on role to avoid unnecessary recalculations
  const selectors = useMemo(() => ({
    user: {
      isAuthenticated: selectIsUserAuthenticated,
      token: selectUserToken,
      accountInfo: selectUser,
      logout: logoutUser,
    },
    admin: {
      isAuthenticated: selectIsAdminAuthenticated,
      token: selectAdminToken,
      accountInfo: selectAdmin,
      logout: logoutAdmin,
    },
    super_admin: {
      isAuthenticated: selectIsSuperAdminAuthenticated,
      token: selectSuperAdminToken,
      accountInfo: selectSuperAdmin,
      logout: logoutSuperAdmin,
    },
  }), []);

  // Default to 'user' role if 'role' is not provided or is invalid
  const currentRole = role && selectors[role] ? role : 'user';

  const { isAuthenticated, token, accountInfo, logout } = selectors[currentRole];

  // Use selectors to access the state from Redux store
  const isAuth = useSelector(isAuthenticated);
  const authToken = useSelector(token);
  const accountData = useSelector(accountInfo); // Renamed to avoid conflict with 'accountInfo'

  useEffect(() => {
    if (!isAuth) {
      toast({
        title: "Not authenticated",
        description: "You need to log in to access the dashboard.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      router.push(`/login/${currentRole}`); // Redirect to login page for the current role
    } else {
      console.log("User role:", accountData?.role);
      // console.log("User token:", authToken);
      // console.log("Account info:", accountData);
      // console.log("User ID:", accountData?.id);
    }
  }, [isAuth, authToken, accountData, currentRole, router, toast]);

  // Render nothing if not authenticated or role is invalid
  if (!isAuth || !role || !selectors[role]) {
    return null;
  }

  return (
    <DashboardLayout
      role={accountData?.role}
      adminFunction={currentRole === 'admin' ? accountData?.adminFunction : undefined}
      accountData={accountData} // Pass the entire accountData object
      logout={() => dispatch(logout())}
    />
  );
};

export default DashboardPage;

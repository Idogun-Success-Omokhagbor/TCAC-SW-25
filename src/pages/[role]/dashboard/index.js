import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/react";
import DashboardLayout from "../../../layouts/dashboard/DashboardLayout";
import {
  selectIsUserAuthenticated,
  selectUserToken,
  selectUser,
  logoutUser,
} from "../../../store/slices/auth/user/userAuthSlice";
import {
  selectIsAdminAuthenticated,
  selectAdminToken,
  selectAdmin,
  logoutAdmin,
} from "../../../store/slices/auth/admin/adminAuthSlice";
import {
  selectIsSuperAdminAuthenticated,
  selectSuperAdminToken,
  selectSuperAdmin,
  logoutSuperAdmin,
} from "../../../store/slices/auth/superAdmin/superAdminAuthSlice";

const DashboardPage = () => {
  const router = useRouter();
  const { role } = router.query;

  const toast = useToast();
  const dispatch = useDispatch();

  // Memoized selector map for role-based authentication
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
    "super-admin": {
      isAuthenticated: selectIsSuperAdminAuthenticated,
      token: selectSuperAdminToken,
      accountInfo: selectSuperAdmin,
      logout: logoutSuperAdmin,
    },
  }), []);

  // Default to 'user' if the role is undefined or invalid
  const currentRole = selectors[role] ? role : "user";

  // Extract necessary selectors
  const { isAuthenticated, token, accountInfo, logout } = selectors[currentRole];

  // Select the current authentication and account data
  const isAuth = useSelector(isAuthenticated);
  const authToken = useSelector(token);
  const accountData = useSelector(accountInfo);

  // Debugging logs to track the flow
  // console.log("Current role:", currentRole);
  // console.log("Is Authenticated (from selector):", isAuth);
  // console.log("Auth Token (from selector):", authToken);
  // console.log("Account data (from selector):", accountData);

  useEffect(() => {
    // console.log("Effect triggered");
    // console.log("isAuth:", isAuth);
    // console.log("authToken:", authToken);
    // console.log("accountData:", accountData);

    // Redirect if the user is not authenticated
    if (!isAuth) {
      toast({
        title: "Not authenticated",
        description: "You need to log in to access the dashboard.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      router.push(`/login/${currentRole}`);
    } else if (accountData && accountData.role) {
      console.log("User role:", accountData.role);
    
    } else {
      console.log("Account data or role is undefined");  // Handle this edge case

    }
  }, [isAuth, authToken, accountData, currentRole, router, toast]);

  // Return null if not authenticated or invalid role
  if (!isAuth || !selectors[currentRole]) {
    console.log("Not authenticated or invalid role");
    return null;
  }

  return (
    <DashboardLayout
      role={accountData?.role}
      adminFunction={currentRole === 'admin' ? accountData?.adminFunction : undefined}
      accountData={accountData}
      logout={() => {
        console.log("Logging out");
        dispatch(logout());
      }}
    />
  );
};

export default DashboardPage;

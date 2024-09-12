import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layouts/dashboard/DashboardLayout";
import SelectedComponentRenderer from "../../components/dashboard/SelectedComponentRenderer";

const DashboardPage = () => {
  const router = useRouter();

  // Get user data from all slices
  const userData = useSelector((state) => state.userAuth.user);
  // Log authenticated user data for debugging purposes
  console.log("Authenticated user data:", userData);

  const adminData = useSelector((state) => state.adminAuth.admin);
  // Log authenticated admin data for debugging purposes
  console.log("Authenticated admin data:", adminData);


  const superAdminData = useSelector(
    (state) => state.superAdminAuth.superAdmin
  );

  // Determine the authenticated role by checking which slice has a valid user
  const [role, setRole] = useState("");
  const [adminFunction, setAdminFunction] = useState("");

  useEffect(() => {
    if (superAdminData) {
      setRole(superAdminData?.role);
    } else if (adminData) {
      setRole(adminData?.role);
      setAdminFunction(adminData?.adminFunction);
    } else if (userData) {
      setRole(userData?.role);
    } else {
      router.push("/login/user"); // Redirect to login if not authenticated
    }
  }, [userData, adminData, superAdminData, router]);


  return (
    <DashboardLayout
    role={role}
    adminFunction={adminFunction}
  />
  );
};

export default DashboardPage;

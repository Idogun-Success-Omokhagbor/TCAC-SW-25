import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import DashboardLayout from "../../layouts/dashboard/DashboardLayout";
import SelectedComponentRenderer from "../../components/dashboard/SelectedComponentRenderer";

const DashboardPage = () => {
  const router = useRouter();

  // Get user data from all slices
  const userData = useSelector((state) => state.userAuth.user);
  const adminData = useSelector((state) => state.adminAuth.admin);
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

  const [selectedComponent, setSelectedComponent] = useState("daily-schedule");

  const handleMenuClick = (menu) => {
    setSelectedComponent(menu);
  };

  return (
    <DashboardLayout
      role={role}
      adminFunction={adminFunction}
      onMenuClick={handleMenuClick}
    >
      <SelectedComponentRenderer
        selectedComponent={selectedComponent}
        role={role}
        adminFunction={adminFunction}
      />
    </DashboardLayout>
  );
};

export default DashboardPage;

// pages/reset-password/[role].js
import { useRouter } from "next/router";
import ResetPasswordAuthLayout from "../../layouts/auth/ResetPasswordAuthLayout";
import UserResetPasswordForm from "../../components/auth/user/UserResetPasswordForm";
import AdminResetPasswordForm from "../../components/auth/admin/AdminResetPasswordForm";

const ResetPassword = () => {
  const router = useRouter();
  const { role = "user" } = router.query;

  // Ensure role is either 'user' or 'admin'
  const resetPasswordForm =
    role === "user" ? (
      <UserResetPasswordForm role={role} />
    ) : (
      <AdminResetPasswordForm role={role} />
    );

  // form heading
  const formHeading =
    role === "user" ? "Reset Password" : "Reset Admin Password";

  return (
    <ResetPasswordAuthLayout
      resetPasswordForm={resetPasswordForm}
      formHeading={formHeading}
      role={role}
    />
  );
};

export default ResetPassword;

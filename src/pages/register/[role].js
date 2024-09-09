import { useRouter } from "next/router";
import { useState } from "react";
import RegisterAuthLayout from "../../layouts/auth/RegisterAuthLayout";
import AdminRegAuthLayout from "../../layouts/auth/adminRegAuthLayout"; 

// user-specific form components
import PersonalInformationForm from "../../components/auth/user/register/PersonalInformationForm";
import CACForm from "../../components/auth/user/register/CACForm";
import MedicalConditionForm from "@/components/auth/user/register/MedicalConditionForm";
import PasswordCreationForm from "../../components/auth/user/register/PasswordCreationForm";
import PaymentForm from "../../components/auth/user/register/PaymentForm";

// admin-specific form component
import AdminRegistrationForm from "../../components/auth/admin/AdminRegistrationForm";

// super-admin-specific form component
import SuperAdminRegistrationForm from "../../components/auth/superAdmin/SuperAdminRegistrationForm";

const Register = () => {
  const router = useRouter();
  const { role = "user" } = router.query; // Capture the role from the URL
  const [step, setStep] = useState(0);

  // State to hold user registration form values
  const [formValues, setFormValues] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    CAC: {
      userCategory: "Student",
      institution: "",
      state: "",
      guardianName: "",
      guardianPhone: "",
      guardianAddress: "",
      nextOfKinName: "",
      nextOfKinPhone: "",
      nextOfKinAddress: "",
    },
    medicalCondition: {
      // Define initial values for medical condition form
      medicalCondition: "",
      conditionDetails: "",
    },
    payment: {
      paymentType: "Full Payment", // Default value for Mode of Payment
      campType: "Camp Only", // Default value for Camp/Conference part
      amount: 5000, // Default amount (₦5000)
      receipt: null,
    },
    password: {
      password: "",
      confirmPassword: "",
    },
    role,
  });

  const handleFormValuesChange = (newValues) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);
  

  const renderUserRegistrationForm = () => {
    return (
      <>
        {step === 0 && (
          <PersonalInformationForm
            values={formValues.personalInfo}
            role={role}
            onValuesChange={(values) =>
              handleFormValuesChange({ personalInfo: values })
            }
            onNext={handleNext}
          />
        )}
        {step === 1 && (
          <CACForm
            values={formValues.CAC}
            role={role}
            onValuesChange={(values) => handleFormValuesChange({ CAC: values })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 2 && (
          <MedicalConditionForm
            values={formValues.medicalCondition}
            role={role}
            onValuesChange={(values) =>
              handleFormValuesChange({ medicalCondition: values })
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 3 && (
          <PaymentForm
            values={formValues.payment}
            role={role}
            onValuesChange={(values) =>
              handleFormValuesChange({ payment: values })
            }
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
        {step === 4 && (
          <PasswordCreationForm
            values={formValues.password}
            role={role}
            onValuesChange={(values) =>
              handleFormValuesChange({ password: values })
            }
            onPrevious={handlePrevious}
          />
        )}
      </>
    );
  };

  const renderAdminRegistrationForm = () => (
    <AdminRegistrationForm role={role} />
  );

  const renderSuperAdminRegistrationForm = () => (
    <SuperAdminRegistrationForm role={role} />
  );

  const renderRoleBasedContent = () => {
    switch (role) {
      case "user":
        return renderUserRegistrationForm();
      case "admin":
        return renderAdminRegistrationForm();
      case "super_admin":
        return renderSuperAdminRegistrationForm();
      default:
        return renderUserRegistrationForm();
    }
  };

  const isAdminOrSuperAdmin = role === "admin" || role === "super_admin";

  return isAdminOrSuperAdmin ? (
    <AdminRegAuthLayout
      formHeading={`Register as ${role}`}
      registrationForm={renderRoleBasedContent()}
      role={role}
    />
  ) : (
    <RegisterAuthLayout currentStep={step} setStep={setStep} role={role}>
      {renderRoleBasedContent()}
    </RegisterAuthLayout>
  );
};

export default Register;

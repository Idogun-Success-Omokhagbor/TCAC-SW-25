import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      default: "user",
    },

    userCategory: {
      type: String,
      enum: ["Student", "Alumnus", "Child", "Non-TIMSANITE"],
      default: "Student",
    },

    registrationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    userID: { type: String },

    institution: { type: String },
    otherInstitution: { type: String },

    graduationYear: { type: Number },

    state: { type: String },
    otherState: { type: String },

    guardianName: { type: String },
    guardianPhone: { type: String },
    guardianAddress: { type: String },

    nextOfKinName: { type: String },
    nextOfKinPhone: { type: String },
    nextOfKinAddress: { type: String },

    medicalCondition: { type: Boolean, default: false },
    conditionDetails: { type: String },

    // Payment-related fields
    paymentType: { type: String },
    campType: { type: String },
    amount: { type: Number },
    receiptUrl: { type: String },
    payementNarration: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

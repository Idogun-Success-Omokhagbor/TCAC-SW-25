import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: "super_admin",
    },

    superAdminID: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.SuperAdmin ||
  mongoose.model("SuperAdmin", superAdminSchema);

import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true},
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Super Admin",  "Reg. Team Lead", "Health Team Lead"],
    default: "Super Admin",
  },

  superAdminID: { type: String },

  

  createdAt: { type: Date, default: Date.now },

},
{timestamps:true}, 
);

export default mongoose.models.SuperAdmin || mongoose.model("SuperAdmin", superAdminSchema);

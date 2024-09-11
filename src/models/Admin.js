import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true},
  password: { type: String, required: true },
  role: { 
    type: String, 
    default: "admin" // Default value for role
  },

  adminFunction: { type: String, enum: ['admin', 'reg_team_lead', 'health_team_lead'], default: 'admin' },

  registrationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  adminID: { type: String },

  

  createdAt: { type: Date, default: Date.now },

},
{timestamps:true}, 
);

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);

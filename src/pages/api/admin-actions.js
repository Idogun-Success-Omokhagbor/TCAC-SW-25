// pages/api/admin-actions.js
import connectDB from "../../utils/connectDB";
import Admin from "../../models/Admin";

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const admins = await Admin.find({});
        res.status(200).json({ success: true, data: admins });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      const { id, action, adminFunction } = req.body;
      try {
        let updatedAdmin;
        if (action === "approve") {
          updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { registrationStatus: "approved" },
            { new: true }
          );
        } else if (action === "reject") {
          updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { registrationStatus: "rejected" },
            { new: true }
          );
        } else if (action === "updateAdminFunction" && adminFunction) {
          updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { adminFunction },
            { new: true }
          );
        }
        res.status(200).json({ success: true, data: updatedAdmin });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}

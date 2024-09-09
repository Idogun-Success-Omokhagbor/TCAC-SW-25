import connectDB from "../../../../utils/connectDB";
import SuperAdmin from "../../../../models/SuperAdmin";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { role, password, email, ...superAdminData } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Check if super admin already exists
      const existingSuperAdmin = await SuperAdmin.findOne({ email });

      if (existingSuperAdmin) {
        return res.status(400).json({ error: "Super Admin already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin
      const newSuperAdmin = new SuperAdmin({
        ...superAdminData,
        email, // Ensure email is included
        password: hashedPassword,
        role, // Ensure role is handled by your Admin schema
      });

      // Save the new admin to the database
      await newSuperAdmin.save();

      // Respond with success message
      return res
        .status(201)
        .json({
          message: "Super Admin registered successfully",
          newSuperAdmin,
        });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

import connectDB from '../../../../utils/connectDB';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcrypt';

// Utility function to generate unique ID for Admin
async function generateAdminID() {
  try {
    const lastAdmin = await Admin.findOne().sort({ $natural: -1 }).limit(1);
    if (lastAdmin) {
      const lastAdminID = lastAdmin.adminID;
      const lastCounter = parseInt(lastAdminID.split("-")[2]);
      const paddedCounter = (lastCounter + 1).toString().padStart(3, "0");
      return `TCAC'24-ADM-${paddedCounter}`;
    } else {
      // If there are no admins in the database yet
      return `TCAC'24-ADM-001`;
    }
  } catch (error) {
    console.error("Error generating admin ID:", error);
    throw new Error("Failed to generate admin ID for admin");
  }
}

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { role, password, email, ...adminData } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists' });
      }

      // Generate unique ID for new admin
      const adminID = await generateAdminID();

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin
      const newAdmin = new Admin({
        ...adminData,
        email,
        password: hashedPassword,
        role,
        adminID, // Ensure adminID is included
      });

      // Save the new admin to the database
      await newAdmin.save();

      // Respond with success message
      return res.status(201).json({ message: 'Admin registered successfully', newAdmin });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

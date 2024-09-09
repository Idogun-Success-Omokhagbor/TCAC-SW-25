// pages/api/auth/admin/register.js
import connectDB from '../../../../utils/connectDB';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcrypt';

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

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create new admin
      const newAdmin = new Admin({
        ...adminData,
        email, // Ensure email is included
        password: hashedPassword,
        role, // Ensure role is handled by your Admin schema
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

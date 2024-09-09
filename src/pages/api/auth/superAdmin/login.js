import connectDB from '../../../../utils/connectDB';
import SuperAdmin from '../../../../models/SuperAdmin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Find the admin by email
      const superAdminData = await SuperAdmin.findOne({ email });

      if (!superAdminData) {
        return res.status(404).json({ error: ' Super Admin not found' });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, superAdminData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        {
          id: superAdminData._id, 
          email: superAdminData.email,
          role: superAdminData.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Super Admin logged in successfully', token, superAdminData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

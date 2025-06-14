import connectDB from "../../../../utils/connectDB";
import Post from "../../../../models/Post";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Token required" });
    }

    const posts = await Post.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
} 
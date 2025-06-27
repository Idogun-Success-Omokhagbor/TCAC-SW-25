import connectDB from "../../../utils/connectDB";
import Post from "../../../models/Post";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments({ isPublished: true })
    ]);
    res.status(200).json({ success: true, data: posts, total, page, limit });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
} 
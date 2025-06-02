import connectDB from "../../../utils/connectDB";
import Payment from "../../../models/Payment";

export default async function handler(req, res) {
  await connectDB();
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
  res.status(200).json({ payments });
}
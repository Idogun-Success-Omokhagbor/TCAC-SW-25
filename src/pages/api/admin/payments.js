import connectDB from "../../../utils/connectDB";
import Payment from "../../../models/Payment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;
    try {
      const payments = await Payment.find(filter)
        .populate({ path: "userId", select: "firstName lastName" })
        .sort({ createdAt: -1 });
      return res.status(200).json(payments);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch payments" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
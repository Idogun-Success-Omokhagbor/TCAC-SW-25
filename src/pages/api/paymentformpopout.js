import connectDB from "../../utils/connectDB";
import Payment from "../../models/Payment";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const {
      userId,
      paymentType,
      campType,
      amount,
      receiptUrl,
      paymentNarration,
      status
    } = req.body;

    if (!userId || !paymentType || !campType || !amount || !receiptUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payment = await Payment.create({
      userId,
      paymentType,
      campType,
      amount,
      receiptUrl,
      paymentNarration,
      status: status || "pending"
    });

    return res.status(200).json({ success: true, payment });
  }

  res.status(405).json({ error: "Method not allowed" });
}
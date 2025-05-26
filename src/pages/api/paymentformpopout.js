import connectDB from "../../utils/connectDB";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { userId, paymentType, amount, receiptUrl } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let paidAmount = user.paidAmount || 0;
    let balance = user.balance !== undefined ? user.balance : 35000; 
    let campType = user.campType || "Camp/Conference";

    if (paymentType === "Full Payment") {
      paidAmount += parseInt(amount);
      balance = 0;
      user.amount = (user.amount || 0) + parseInt(amount);
    } else if (paymentType === "Installmental") {
      paidAmount += parseInt(amount);
      balance = balance - parseInt(amount);
      if (balance < 0) balance = 0;
      user.amount = (user.amount || 0) + parseInt(amount);
    }

    user.paidAmount = paidAmount;
    user.balance = balance;
    user.campType = campType;
    user.receiptUrl = receiptUrl;

    await user.save();

    return res.status(200).json({ success: true, paidAmount, balance, campType, amount: user.amount });
  }

  res.status(405).json({ error: "Method not allowed" });
}
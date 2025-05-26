import connectDB from "../../../../utils/connectDB";
import User from "../../../../models/User";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { role, email, password, userCategory } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcryptjs.hash(password, 12);
      const userID = await generateUserID(userCategory);

      const newUser = new User({
        ...req.body,
        password: hashedPassword,
        userID,
        registrationStatus: "pending",
        balance: 35000, // Set default balance
      });

      await newUser.save();
      console.log("New User Saved:", newUser);

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

function getCategoryID(userCategory) {
  switch (userCategory.toLowerCase()) {
    case "student":
      return "STD";
    case "alumnus":
      return "IOTB";
    case "children":
      return "CHLD";
    case "nontimsanite":
      return "NTMS";
    default:
      return "";
  }
}

function generateParticipantID(abbreviation, counter) {
  const paddedCounter = counter.toString().padStart(3, "0");
  return `${abbreviation}${paddedCounter}`;
}

async function generateUserID(userCategory) {
  const categoryID = getCategoryID(userCategory);
  const houseAbbreviations = ["ABU", "UMR", "UTH", "ALI"];

  const lastUser = await User.findOne().sort({ $natural: -1 }).limit(1);

  let participantID;
  let participantIDCounter = 1;

  if (lastUser && lastUser.userID) {
    const lastParticipantID = lastUser.userID.split("-").pop();
    const lastAbbreviation = lastParticipantID.substring(0, 3);
    const lastCounter = parseInt(lastParticipantID.substring(3), 10);

    if (lastAbbreviation === "ALI") {
      participantIDCounter = lastCounter + 1;
      participantID = generateParticipantID("ABU", participantIDCounter);
    } else {
      const lastIndex = houseAbbreviations.indexOf(lastAbbreviation);
      const nextIndex = (lastIndex + 1) % houseAbbreviations.length;
      const nextAbbreviation = houseAbbreviations[nextIndex];
      participantID = generateParticipantID(nextAbbreviation, lastCounter);
    }
  } else {
    participantID = generateParticipantID("ABU", participantIDCounter);
  }

  return `TCAC'24-${categoryID}-${participantID}`;
}
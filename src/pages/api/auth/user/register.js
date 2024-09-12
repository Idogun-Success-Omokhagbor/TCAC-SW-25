import connectDB from '../../../../utils/connectDB';
import User from '../../../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
    // console.log("Incoming request body:", req.body); // Log the incoming request body

    // Extract mergedValues from req.body
    const { mergedValues } = req.body;
    console.log("Destructured form values:", mergedValues); // Log the destructured values

    if (!mergedValues) {
      return res.status(400).json({ error: 'No form values provided' });
    }

    const email = mergedValues.email;
    const password = mergedValues.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      console.log(`Role: ${mergedValues.role}`);
      console.log(`Email: ${mergedValues.email}`);
      console.log(`User Category: ${mergedValues.userCategory}`);

      const existingUser = await User.findOne({ email: mergedValues.email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userID = await generateUserID(mergedValues.userCategory);

      const newUser = new User({
        ...mergedValues,
        password: hashedPassword,
        userID,
        registrationStatus: 'pending',
      });

      await newUser.save();
      console.log('New User Saved:', newUser);

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}



// Function to get the category abbreviation for userID
function getCategoryID(userCategory) {
  switch (userCategory.toLowerCase()) {
    case 'student': return 'STD';
    case 'alumnus': return 'IOTB';
    case 'children': return 'CHLD';
    case 'nontimsanite': return 'NTMS';
    default: return '';
  }
}

// Helper function to generate participant ID
function generateParticipantID(abbreviation, counter) {
  const paddedCounter = counter.toString().padStart(3, '0'); // Zero-padding counter
  return `${abbreviation}${paddedCounter}`;
}

// Main function to generate a unique userID
async function generateUserID(userCategory) {
  const categoryID = getCategoryID(userCategory); // Get the category ID based on userCategory
  const houseAbbreviations = ['ABU', 'UMR', 'UTH', 'ALI'];

  // Fetch the most recent user from the database
  const lastUser = await User.findOne().sort({ $natural: -1 }).limit(1);
  
  let participantID;
  let participantIDCounter = 1; // Default counter

  if (lastUser && lastUser.userID) {
    const lastParticipantID = lastUser.userID.split('-').pop(); // Extract the ID part
    const lastAbbreviation = lastParticipantID.substring(0, 3); // Extract the house abbreviation
    const lastCounter = parseInt(lastParticipantID.substring(3), 10); // Extract and convert the counter

    // Determine the next participant ID
    if (lastAbbreviation === 'ALI') {
      participantIDCounter = lastCounter + 1;
      participantID = generateParticipantID('ABU', participantIDCounter);
    } else {
      const lastIndex = houseAbbreviations.indexOf(lastAbbreviation);
      const nextIndex = (lastIndex + 1) % houseAbbreviations.length;
      const nextAbbreviation = houseAbbreviations[nextIndex];
      participantID = generateParticipantID(nextAbbreviation, lastCounter);
    }
  } else {
    // Default participant ID if no last user exists
    participantID = generateParticipantID('ABU', participantIDCounter);
  }

  // Return the final userID
  return `TCAC'24-${categoryID}-${participantID}`;
}



// Define service account credentials for Google Sheets API
const credentials = {
  type: "service_account",
  project_id: "toycac24-419900",
  private_key_id: "b38cc9c45f42f7d6aa654f24eca5cd8360ce385f",
  private_key: "YOUR_PRIVATE_KEY",
  client_email: "toycac@toycac24-419900.iam.gserviceaccount.com",
  client_id: "102162798731964732623",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/toycac%40toycac24-419900.iam.gserviceaccount.com",
};

// Append data to Google Sheets
async function appendToSheet(newUser) {
  try {
    // Initialize Google Auth with credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the data to append
    const values = [
      [
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.phoneNumber,
        newUser.userCategory,
        newUser.userID,
        newUser.receiptUrl,
        newUser.registrationStatus,
        newUser.timestamps,
      ],
    ];

    // Set the request details
    const request = {
      spreadsheetId: "1Ezna-5Jcaf9Cp24xdvAxcA-Nw18N2qsa0EGE0QiATxs",
      range: "Sheet1",
      valueInputOption: "RAW",
      resource: { values },
    };

    // Append the data
    const response = await sheets.spreadsheets.values.append(request);
    console.log("Data appended successfully:", response.data);
  } catch (error) {
    console.error("Error appending data:", error);
  }
}


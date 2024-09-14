import { IncomingForm } from "formidable";
import { put } from "@vercel/blob";

// Disable body parsing to handle form data with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data with `formidable` and return a Promise
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      // Parse the form data
      const { files } = await parseForm(req);

      // Ensure a file is present
      if (!files.file || files.file.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = files.file[0]; // Formidable stores files as arrays in 'files'

      // Upload the file
      const blob = await put(file.originalFilename, file.filepath, {
        access: "public",
      });

      // Send response
      return res.status(200).json(blob);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to process file", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

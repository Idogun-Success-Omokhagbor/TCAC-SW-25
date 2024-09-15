import fs from 'fs';
import { IncomingForm } from 'formidable';
import { put } from '@vercel/blob';

// Disable body parsing to handle form data with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data with `formidable`
function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: './tmp', // Ensure this directory exists
      keepExtensions: true, // Keep file extensions
    });
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
  if (req.method === 'PUT') {
    try {
      // Parse the form data
      const { files } = await parseForm(req);

      // Ensure a file is present
      if (!files.file || files.file.length === 0) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = files.file[0]; // Formidable stores files as arrays in 'files'
      const filePath = file.filepath;

      // Read the file into memory
      const fileBuffer = fs.readFileSync(filePath);

      // Upload the file to Vercel Blob
      const blob = await put(file.originalFilename, fileBuffer, { access: 'public' });

      // Remove the file after uploading
      fs.unlinkSync(filePath);

      // Send response with blob information
      return res.status(200).json(blob);
    } catch (error) {
      console.error('Upload error:', error); // Log errors for debugging
      return res.status(500).json({ error: 'Failed to process file', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}






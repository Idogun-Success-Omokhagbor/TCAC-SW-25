import fs from 'fs';
import { IncomingForm } from 'formidable';
import { put } from '@vercel/blob';

// Disable body parsing to handle form data with formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to parse form data with `formidable`function parseForm(req) {
  function parseForm(req) {
    return new Promise((resolve, reject) => {
      const form = new IncomingForm({
        keepExtensions: true,
        uploadDir: null // Don't use a disk-based directory
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
        // console.log('Received file upload request');
  
        const { files } = await parseForm(req);
        // console.log('Files received:', files);
  
        if (!files.file || files.file.length === 0) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
  
        const file = files.file[0];
        // console.log('Processing file:', file);
  
        const fileBuffer = file.filepath ? fs.readFileSync(file.filepath) : file; // Handle in-memory files
  
        // console.log('File buffer size:', fileBuffer.length);
  
        // Upload to Vercel Blob
        const blob = await put(file.originalFilename, fileBuffer, { access: 'public' });
        console.log('File uploaded successfully:', blob);
  
        return res.status(200).json(blob);
      } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Failed to process file', details: error.message });
      }
    } else {
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
  






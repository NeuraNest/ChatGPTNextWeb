import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Here you can handle the file upload.
    // The file will be in req.body.
    // You can use a library like 'formidable' to parse the file from the request.

    res.status(200).json({ message: "File uploaded successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

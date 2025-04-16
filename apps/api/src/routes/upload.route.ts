import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize Multer upload
const upload = multer({ storage });

// File Upload Route
// @ts-ignore
router.post("/", upload.array("images", 5), (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Explicitly cast `req.files` to the correct type
  const uploadedFiles = req.files as Express.Multer.File[];

  const fileUrls = uploadedFiles.map((file) => `/uploads/${file.filename}`);
  return res.json(fileUrls);
});



router.post("/categories", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default router;

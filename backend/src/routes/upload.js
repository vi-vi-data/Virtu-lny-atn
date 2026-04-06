import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadImage } from '../services/blobStorage.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Uploaded file must be an image.' });
    }

    const imageUrl = await uploadImage(req.file.buffer, req.file.originalname);

    res.status(201).json({ imageUrl });
  } catch (error) {
    next(error);
  }
});

export default router;

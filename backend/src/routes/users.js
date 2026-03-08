import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { getMe, updateMe } from '../controllers/usersController.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put(
  '/me',
  upload.single('avatar'),
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('bio').optional().trim(),
  ],
  updateMe
);

export default router;

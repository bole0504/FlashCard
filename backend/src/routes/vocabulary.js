import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import {
  getVocabularies,
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} from '../controllers/vocabularyController.js';

const router = express.Router();

router.use(protect);

router.get('/', getVocabularies);
router.get('/:id', getVocabulary);
router.post(
  '/',
  upload.single('image'),
  [
    body('word').trim().notEmpty().withMessage('Word is required'),
    body('meaning').trim().notEmpty().withMessage('Meaning is required'),
    body('example').trim().notEmpty().withMessage('Example is required'),
  ],
  createVocabulary
);
router.put(
  '/:id',
  upload.single('image'),
  [
    body('word').optional().trim().notEmpty().withMessage('Word cannot be empty'),
    body('meaning').optional().trim().notEmpty().withMessage('Meaning cannot be empty'),
    body('example').optional().trim().notEmpty().withMessage('Example cannot be empty'),
  ],
  updateVocabulary
);
router.delete('/:id', deleteVocabulary);

export default router;

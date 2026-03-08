import express from 'express';
import { protect } from '../middleware/auth.js';
import { getSlots } from '../controllers/slotsController.js';

const router = express.Router();

router.use(protect);

router.get('/', getSlots);

export default router;

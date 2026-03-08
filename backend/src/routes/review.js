import express from 'express';
import { protect } from '../middleware/auth.js';
import { getReviewSession, completeReview, getHint, verifyCard } from '../controllers/reviewController.js';

const router = express.Router();

router.use(protect);

router.get('/session', getReviewSession);
router.get('/hint/:vocabId', getHint);
router.post('/verify-card', verifyCard);
router.post('/complete', completeReview);

export default router;

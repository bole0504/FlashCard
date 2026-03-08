import express from 'express';
import { protect } from '../middleware/auth.js';
import { getFriends, searchUsers, addFriend, removeFriend } from '../controllers/friendsController.js';

const router = express.Router();

router.use(protect);

router.get('/', getFriends);
router.get('/search', searchUsers); // must be before /:userId
router.post('/:userId', addFriend);
router.delete('/:userId', removeFriend);

export default router;

import User from '../models/User.js';
import { resetDailyIfNeeded, getAvailableSlots } from '../utils/slots.js';

/**
 * GET /api/slots
 * Get current user's add slots (available, total, used)
 */
export const getSlots = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    resetDailyIfNeeded(user);
    await user.save();
    const slots = getAvailableSlots(user);
    res.json({ ...slots, streak: user.streak || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

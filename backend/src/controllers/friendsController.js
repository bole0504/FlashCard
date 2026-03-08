import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';

/**
 * GET /api/friends
 * Get current user's friends with word count, streak, level. Includes current user for comparison.
 */
export const getFriends = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate('friends', 'name email avatar streak')
      .select('name avatar streak')
      .lean();

    const friendIds = currentUser?.friends?.map((f) => f._id) || [];
    const allUserIds = [req.user._id, ...friendIds];

    const wordCounts = await Vocabulary.aggregate([
      { $match: { userId: { $in: allUserIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(wordCounts.map((c) => [c._id.toString(), c.count]));
    const myWordCount = countMap[req.user._id.toString()] ?? 0;
    const myStreak = currentUser?.streak ?? 0;

    const friends = (currentUser?.friends || []).map((f) => ({
      _id: f._id,
      name: f.name,
      email: f.email,
      avatar: f.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(f.name || '')}&size=128&background=6E39D0&color=fff`,
      wordCount: countMap[f._id.toString()] ?? 0,
      streak: f.streak ?? 0,
    }));

    const withMe = [
      {
        _id: req.user._id,
        name: currentUser?.name || req.user.name,
        email: req.user.email,
        avatar: currentUser?.avatar || req.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || '')}&size=128&background=6E39D0&color=fff`,
        wordCount: myWordCount,
        streak: myStreak,
        isMe: true,
      },
      ...friends,
    ];

    const byWordCount = [...withMe].sort((a, b) => b.wordCount - a.wordCount);
    const byStreak = [...withMe].sort((a, b) => b.streak - a.streak);
    const myRankByWords = byWordCount.findIndex((u) => u.isMe) + 1;
    const myRankByStreak = byStreak.findIndex((u) => u.isMe) + 1;

    res.json({
      friends: friends,
      me: {
        _id: req.user._id,
        name: currentUser?.name || req.user.name,
        wordCount: myWordCount,
        streak: myStreak,
        rankByWords: myRankByWords,
        rankByStreak: myRankByStreak,
        totalInGroup: withMe.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/users/search?q=
 * Search users by name (exclude self and existing friends)
 */
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const currentUser = await User.findById(req.user._id).select('friends');
    const excludeIds = [req.user._id, ...(currentUser.friends || [])];

    const users = await User.find({
      _id: { $nin: excludeIds },
      $or: [
        { name: { $regex: q.trim(), $options: 'i' } },
        { email: { $regex: q.trim(), $options: 'i' } },
      ],
    })
      .select('name email')
      .limit(20)
      .lean();

    const userIds = users.map((u) => u._id);
    const wordCounts = await Vocabulary.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(wordCounts.map((c) => [c._id.toString(), c.count]));

    const result = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      wordCount: countMap[u._id.toString()] ?? 0,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/friends/:userId
 * Add friend (mutual)
 */
export const addFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(currentUserId);

    if (currentUser.friends?.some((f) => f.toString() === userId)) {
      return res.status(400).json({ message: 'Already friends' });
    }

    currentUser.friends = currentUser.friends || [];
    currentUser.friends.push(userId);
    await currentUser.save();

    targetUser.friends = targetUser.friends || [];
    if (!targetUser.friends.some((f) => f.toString() === currentUserId.toString())) {
      targetUser.friends.push(currentUserId);
      await targetUser.save();
    }

    res.json({ message: 'Friend added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/friends/:userId
 * Remove friend (mutual)
 */
export const removeFriend = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(userId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.friends = (currentUser.friends || []).filter((f) => f.toString() !== userId);
    await currentUser.save();

    targetUser.friends = (targetUser.friends || []).filter((f) => f.toString() !== currentUserId.toString());
    await targetUser.save();

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

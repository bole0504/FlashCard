import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';

function getWeekBounds() {
  const now = new Date();
  const day = now.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + mondayOffset);
  monday.setUTCHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setUTCDate(monday.getUTCDate() + 7);
  return { start: monday, end: nextMonday };
}

function getMonthBounds() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { start, end };
}

/**
 * GET /api/leaderboard?period=week|month&limit=20
 * Top users by new vocab count in period
 */
export const getLeaderboard = async (req, res) => {
  try {
    const period = (req.query.period || 'week').toLowerCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);

    const bounds = period === 'month' ? getMonthBounds() : getWeekBounds();

    const currentUserId = req.user?._id;

    const allByCount = await Vocabulary.aggregate([
      { $match: { createdAt: { $gte: bounds.start, $lt: bounds.end } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { name: 1, avatar: 1 } }],
        },
      },
      { $unwind: '$user' },
      { $project: { userId: '$_id', name: '$user.name', avatar: '$user.avatar', count: 1, _id: 0 } },
    ]);

    const withRank = allByCount.slice(0, limit).map((r, i) => ({
      rank: i + 1,
      userId: r.userId,
      name: r.name,
      avatar: r.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name || '')}&size=128&background=6E39D0&color=fff`,
      count: r.count,
    }));

    const myIndex = allByCount.findIndex((r) => r.userId.toString() === currentUserId?.toString());
    const myRank =
      myIndex >= 0
        ? {
            rank: myIndex + 1,
            userId: allByCount[myIndex].userId,
            name: allByCount[myIndex].name,
            avatar: allByCount[myIndex].avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(allByCount[myIndex].name || '')}&size=128&background=6E39D0&color=fff`,
            count: allByCount[myIndex].count,
          }
        : null;

    res.json({
      period,
      rankings: withRank,
      myRank,
      bounds: {
        start: bounds.start.toISOString(),
        end: bounds.end.toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

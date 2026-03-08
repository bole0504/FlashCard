import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';
import { resetDailyIfNeeded, getAvailableSlots, getUnlockAmount } from '../utils/slots.js';
import { updateStreak } from '../utils/streak.js';

const REVIEW_COUNT = 5;

/**
 * GET /api/review/session
 * Get 5 random vocabularies for review (image only, no word - for display)
 */
export const getReviewSession = async (req, res) => {
  try {
    const vocabs = await Vocabulary.aggregate([
      { $match: { userId: req.user._id } },
      { $sample: { size: REVIEW_COUNT } },
      { $project: { _id: 1, image: 1 } },
    ]);

    if (vocabs.length < REVIEW_COUNT) {
      return res.status(400).json({
        message: `Need at least ${REVIEW_COUNT} vocabularies to start a review.`,
        code: 'NOT_ENOUGH_VOCAB',
      });
    }

    res.json({ vocabs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/review/hint/:vocabId
 * Get first letter hint for a vocabulary (for power-up during review)
 */
export const getHint = async (req, res) => {
  try {
    const vocab = await Vocabulary.findOne({
      _id: req.params.vocabId,
      userId: req.user._id,
    })
      .select('word')
      .lean();

    if (!vocab?.word) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }

    const firstLetter = (vocab.word || '').trim().charAt(0).toLowerCase();
    res.json({ firstLetter: firstLetter || '' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/review/verify-card
 * Body: { vocabId, answer }
 * Returns { correct: true } or { correct: false, vocab: fullVocab } for review when wrong
 */
export const verifyCard = async (req, res) => {
  try {
    const { vocabId, answer } = req.body;
    if (!vocabId) {
      return res.status(400).json({ message: 'vocabId is required' });
    }

    const vocab = await Vocabulary.findOne({
      _id: vocabId,
      userId: req.user._id,
    }).lean();

    if (!vocab) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }

    const normalized = (answer || '').trim().toLowerCase();
    const expected = (vocab.word || '').trim().toLowerCase();
    const correct = normalized === expected;

    if (correct) {
      return res.json({ correct: true });
    }

    const { word, meaning, pronunciation, example, partOfSpeech, pastTense, futureTense, tags } = vocab;
    res.json({
      correct: false,
      vocab: { word, meaning, pronunciation, example, partOfSpeech, pastTense, futureTense, tags: tags || [] },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/review/complete
 * Body: { results: [{ vocabId, answer }] }
 * Server verifies each answer. If 5/5 correct, grant unlock.
 */
export const completeReview = async (req, res) => {
  try {
    const { results } = req.body;
    if (!Array.isArray(results) || results.length !== REVIEW_COUNT) {
      return res.status(400).json({ message: 'Invalid results. Need exactly 5 answers.' });
    }

    const ids = results.map((r) => r.vocabId);
    const vocabs = await Vocabulary.find({ _id: { $in: ids }, userId: req.user._id }).lean();
    const vocabMap = Object.fromEntries(vocabs.map((v) => [v._id.toString(), v]));

    let correctCount = 0;
    for (const { vocabId, answer } of results) {
      const v = vocabMap[vocabId?.toString()];
      if (!v) continue;
      const normalized = (answer || '').trim().toLowerCase();
      const expected = (v.word || '').trim().toLowerCase();
      if (normalized === expected) correctCount++;
    }

    if (correctCount < REVIEW_COUNT) {
      return res.json({
        passed: false,
        correctCount,
        total: REVIEW_COUNT,
        message: `Need ${REVIEW_COUNT}/${REVIEW_COUNT} correct. You got ${correctCount}/${REVIEW_COUNT}.`,
      });
    }

    const user = await User.findById(req.user._id);
    resetDailyIfNeeded(user);
    const passCount = user.reviewPassCountToday || 0;
    const unlockAmount = getUnlockAmount(passCount);
    user.reviewPassCountToday = passCount + 1;
    user.unlockedSlots = (user.unlockedSlots || 0) + unlockAmount;
    updateStreak(user);
    await user.save();

    const { available, total } = getAvailableSlots(user);

    res.json({
      passed: true,
      correctCount: REVIEW_COUNT,
      total: REVIEW_COUNT,
      unlockedSlots: unlockAmount,
      slotsAvailable: available,
      slotsTotal: total,
      message: `You passed! +${unlockAmount} slot(s) unlocked.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Vocabulary from '../models/Vocabulary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { resetDailyIfNeeded, getAvailableSlots } from '../utils/slots.js';
import { updateStreak } from '../utils/streak.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getVocabularies = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const filter = { userId: req.user._id };

    if (search) {
      filter.$or = [
        { word: { $regex: search, $options: 'i' } },
        { meaning: { $regex: search, $options: 'i' } },
      ];
    }

    if (tag) {
      filter.tags = tag;
    }

    const vocabularies = await Vocabulary.find(filter).sort({ createdAt: -1 });
    res.json(vocabularies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }

    res.json(vocabulary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVocabulary = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { word, meaning, pronunciation, example, tags, partOfSpeech, pastTense, futureTense } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findById(req.user._id);
    resetDailyIfNeeded(user);
    const { available } = getAvailableSlots(user);
    if (available <= 0) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        message: 'Daily limit reached. Complete a review session to unlock more slots.',
        code: 'DAILY_LIMIT_REACHED',
      });
    }

    const wordNormalized = word.trim().toLowerCase();
    const existing = await Vocabulary.findOne({
      userId: req.user._id,
      word: { $regex: new RegExp(`^${wordNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    });
    if (existing) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Word already exists in your vocabulary' });
    }

    const tagsArray = typeof tags === 'string' ? (tags ? tags.split(',').map((t) => t.trim()) : []) : tags || [];

    const vocabulary = await Vocabulary.create({
      userId: req.user._id,
      word,
      meaning,
      pronunciation: pronunciation || '',
      example,
      partOfSpeech: partOfSpeech || '',
      pastTense: pastTense || '',
      futureTense: futureTense || '',
      image: imagePath,
      tags: tagsArray,
    });

    user.dailyAddCount = (user.dailyAddCount || 0) + 1;
    updateStreak(user);
    await user.save();

    res.status(201).json(vocabulary);
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!vocabulary) {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Vocabulary not found' });
    }

    const { word, meaning, pronunciation, example, tags, partOfSpeech, pastTense, futureTense } = req.body;

    if (word) {
      const wordNormalized = word.trim().toLowerCase();
      const existing = await Vocabulary.findOne({
        userId: req.user._id,
        _id: { $ne: req.params.id },
        word: { $regex: new RegExp(`^${wordNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
      });
      if (existing) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Word already exists in your vocabulary' });
      }
      vocabulary.word = word;
    }
    if (meaning) vocabulary.meaning = meaning;
    if (pronunciation !== undefined) vocabulary.pronunciation = pronunciation;
    if (example !== undefined) vocabulary.example = example;
    if (partOfSpeech !== undefined) vocabulary.partOfSpeech = partOfSpeech;
    if (pastTense !== undefined) vocabulary.pastTense = pastTense;
    if (futureTense !== undefined) vocabulary.futureTense = futureTense;
    if (tags !== undefined) {
      vocabulary.tags =
        typeof tags === 'string'
          ? (tags ? tags.split(',').map((t) => t.trim()) : [])
          : tags;
    }

    if (req.file) {
      if (vocabulary.image) {
        const oldPath = path.join(__dirname, '..', '..', 'uploads', path.basename(vocabulary.image));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      vocabulary.image = `/uploads/${req.file.filename}`;
    }

    await vocabulary.save();
    res.json(vocabulary);
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteVocabulary = async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary not found' });
    }

    if (vocabulary.image) {
      const imagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(vocabulary.image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Vocabulary deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

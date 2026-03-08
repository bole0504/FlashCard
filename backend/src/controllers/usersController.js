import User from '../models/User.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getDefaultAvatarUrl(name) {
  const encoded = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&size=128&background=6E39D0&color=fff`;
}

function toUserResponse(user) {
  const u = user.toObject ? user.toObject() : user;
  return {
    ...u,
    avatar: u.avatar || getDefaultAvatarUrl(u.name),
  };
}

/**
 * GET /api/users/me
 * Get current user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(toUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/users/me
 * Update profile (name, bio, avatar)
 */
export const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, bio, removeAvatar } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();

    if (removeAvatar === 'true' || removeAvatar === true) {
      if (user.avatar) {
        const basename = path.basename(user.avatar);
        if (basename && !basename.startsWith('http')) {
          const oldPath = path.join(__dirname, '..', '..', 'uploads', basename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      user.avatar = null;
    } else if (req.file) {
      if (user.avatar) {
        const basename = path.basename(user.avatar);
        if (basename && !basename.startsWith('http')) {
          const oldPath = path.join(__dirname, '..', '..', 'uploads', basename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      }
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json(toUserResponse(user));
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

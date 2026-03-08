import mongoose from 'mongoose';

const vocabularySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
    },
    meaning: {
      type: String,
      required: [true, 'Meaning is required'],
      trim: true,
    },
    pronunciation: {
      type: String,
      trim: true,
    },
    example: {
      type: String,
      required: [true, 'Example is required'],
      trim: true,
    },
    partOfSpeech: {
      type: String,
      trim: true,
      default: '',
    },
    pastTense: {
      type: String,
      trim: true,
      default: '',
    },
    futureTense: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

vocabularySchema.index({ userId: 1, word: 1 }, { unique: true });

export default mongoose.model('Vocabulary', vocabularySchema);

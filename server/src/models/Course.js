const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // YouTube/Vimeo/hosted URL
  duration: { type: String, default: '' }, // e.g. "12:30"
  order: { type: Number, default: 0 },

  // AI study aid (Groq) — generated once per lesson on first request, then
  // cached here so every future student reuses it for free with no extra API call.
  aiExplanation: { type: String, default: '' },
  aiExercises: [exerciseSchema],
  aiGeneratedAt: { type: Date }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    category: {
      type: String,
      enum: ['coding-online', 'coding-offline', 'tutoring-online', 'tutoring-offline'],
      required: true
    },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, required: true, default: 0 }, // in ETB
    isFree: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    modules: [moduleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });

// Virtual: total lesson count (used for progress % calculations)
courseSchema.methods.getTotalLessons = function () {
  return this.modules.reduce((sum, m) => sum + m.lessons.length, 0);
};

module.exports = mongoose.model('Course', courseSchema);

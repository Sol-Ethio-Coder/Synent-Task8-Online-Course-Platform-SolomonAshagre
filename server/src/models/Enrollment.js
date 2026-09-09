const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    paymentMethod: { type: String, enum: ['chapa', 'manual'], default: 'chapa' },

    chapaTxRef: { type: String, unique: true, sparse: true },
    chapaCheckoutUrl: { type: String },

    // Manual bank/mobile-money transfer flow: the student uploads a receipt
    // screenshot, an admin reviews it and approves/rejects.
    receiptImage: { type: String }, // base64 data URI
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    rejectionReason: { type: String },

    amountPaid: { type: Number, required: true }, // in ETB
    currency: { type: String, default: 'ETB' },
    status: {
      type: String,
      enum: ['created', 'pending_review', 'paid', 'failed', 'rejected'],
      default: 'created'
    },

    enrolledAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);

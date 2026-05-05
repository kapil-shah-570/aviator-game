const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roundId: { type: mongoose.Schema.Types.ObjectId, ref: 'Round', required: true },
  amount: { type: Number, required: true },
  cashoutMultiplier: { type: Number, default: null },
  profit: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'cashed_out', 'crashed'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bet', betSchema);
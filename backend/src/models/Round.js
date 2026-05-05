const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundId: { type: String, required: true, unique: true },
  crashPoint: { type: Number, required: true },
  serverSeed: String,
  clientSeed: String,
  hash: String,
  status: { type: String, enum: ['waiting', 'flying', 'crashed'], default: 'waiting' },
  startTime: Date,
  endTime: Date,
  multiplier: { type: Number, default: 1.0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Round', roundSchema);
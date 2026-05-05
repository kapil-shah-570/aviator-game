const crypto = require('crypto');
const { generateCrashPoint } = require('./crashLogic');

// Generate a new seed pair for a round
const generateSeedPair = () => {
  return {
    serverSeed: crypto.randomBytes(32).toString('hex'),
    clientSeed: crypto.randomBytes(16).toString('hex'),
    nonce: Date.now()
  };
};

// Hash a seed for display before round ends
const hashSeed = (seed) => {
  return crypto.createHash('sha256').update(seed).digest('hex');
};

// Verify a completed round
const verifyRoundResult = (round) => {
  const computedCrash = generateCrashPoint(
    round.serverSeed,
    round.clientSeed,
    round.nonce
  );
  return computedCrash === round.crashPoint;
};

module.exports = {
  generateSeedPair,
  hashSeed,
  verifyRoundResult
};
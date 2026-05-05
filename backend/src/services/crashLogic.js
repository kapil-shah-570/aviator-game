const crypto = require('crypto');

// HMAC-SHA256 provably fair crash point generation
// Returns a multiplier between 1.00 and 1000.00
function generateCrashPoint(serverSeed, clientSeed, nonce) {
  const hmac = crypto.createHmac('sha256', serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);
  const hash = hmac.digest('hex');
  
  // Use first 8 hex chars as a decimal between 0 and 1
  const decimal = parseInt(hash.substring(0, 8), 16) / 0xffffffff;
  
  // Crash formula: max(1.00, 1/(1 - decimal * 0.99))
  let crash = 1 / (1 - decimal * 0.99);
  crash = Math.min(crash, 1000);
  return Math.round(crash * 100) / 100;
}

// Generate seeds for a round
function generateSeeds() {
  return {
    serverSeed: crypto.randomBytes(32).toString('hex'),
    clientSeed: crypto.randomBytes(16).toString('hex'),
    nonce: Date.now()
  };
}

// Verify a previous round
function verifyRound(round) {
  const computed = generateCrashPoint(round.serverSeed, round.clientSeed, round.nonce);
  return computed === round.crashPoint;
}

module.exports = { generateCrashPoint, generateSeeds, verifyRound };
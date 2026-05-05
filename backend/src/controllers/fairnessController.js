const Round = require('../models/Round');
const { verifyRound, generateCrashPoint } = require('../services/crashLogic');

// @desc    Verify a specific round's crash point
// @route   GET /api/fairness/verify/:roundId
// @access  Public
exports.verifyRound = async (req, res) => {
  try {
    const round = await Round.findById(req.params.roundId);
    if (!round) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Verify crash point using the stored seeds
    const isValid = verifyRound(round);
    
    // Recalculate for transparency
    const recalculatedCrash = generateCrashPoint(
      round.serverSeed,
      round.clientSeed,
      round.nonce || 0 // if you stored nonce, else use timestamp
    );

    res.json({
      roundId: round.roundId,
      crashPoint: round.crashPoint,
      serverSeed: round.serverSeed,
      clientSeed: round.clientSeed,
      verified: isValid,
      recalculatedCrash,
      status: round.status,
      startTime: round.startTime,
      endTime: round.endTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent seeds for verification
// @route   GET /api/fairness/seeds
// @access  Public
exports.getSeeds = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const rounds = await Round.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('roundId crashPoint serverSeed clientSeed createdAt');
    
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get server seed for current/latest round (optional)
// @route   GET /api/fairness/current-seed
// @access  Public
exports.getCurrentSeed = async (req, res) => {
  try {
    const latestRound = await Round.findOne().sort({ createdAt: -1 });
    if (!latestRound) {
      return res.status(404).json({ message: 'No rounds found' });
    }
    
    res.json({
      roundId: latestRound.roundId,
      serverSeedHash: require('crypto')
        .createHash('sha256')
        .update(latestRound.serverSeed)
        .digest('hex'),
      clientSeed: latestRound.clientSeed,
      message: 'Server seed will be revealed after round ends',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// const express = require('express');
// const Round = require('../models/Round');
// const { verifyRound } = require('../services/crashLogic');

// const router = express.Router();

// router.get('/verify/:roundId', async (req, res) => {
//   const round = await Round.findById(req.params.roundId);
//   if (!round) return res.status(404).json({ message: 'Round not found' });
  
//   const isValid = verifyRound(round);
//   res.json({
//     roundId: round.roundId,
//     crashPoint: round.crashPoint,
//     serverSeed: round.serverSeed,
//     clientSeed: round.clientSeed,
//     verified: isValid
//   });
// });

// router.get('/seeds', async (req, res) => {
//   const rounds = await Round.find().select('roundId crashPoint serverSeed clientSeed').limit(100);
//   res.json(rounds);
// });

// module.exports = router;






const express = require('express');
const {
  verifyRound,
  getSeeds,
  getCurrentSeed,
} = require('../controllers/fairnessController');

const router = express.Router();

router.get('/verify/:roundId', verifyRound);
router.get('/seeds', getSeeds);
router.get('/current-seed', getCurrentSeed);

module.exports = router;
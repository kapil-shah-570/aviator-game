// const express = require('express');
// const { protect, admin } = require('../middleware/auth');
// const User = require('../models/User');
// const Round = require('../models/Round');
// const Bet = require('../models/Bet');

// const router = express.Router();

// router.use(protect, admin);

// router.get('/stats', async (req, res) => {
//   const totalUsers = await User.countDocuments();
//   const totalBets = await Bet.countDocuments();
//   const totalVolume = await Bet.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
//   const rounds = await Round.find().sort({ createdAt: -1 }).limit(20);
  
//   res.json({
//     totalUsers,
//     totalBets,
//     totalVolume: totalVolume[0]?.total || 0,
//     recentRounds: rounds
//   });
// });

// router.post('/adjust-balance', async (req, res) => {
//   const { userId, amount } = req.body;
//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   user.balance += amount;
//   await user.save();
//   res.json({ newBalance: user.balance });
// });

// module.exports = router;









const express = require('express');
const { protect, admin } = require('../middleware/auth');
const {
  getStats,
  getUsers,
  adjustBalance,
  getRounds,
  getRoundBets,
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.post('/adjust-balance', adjustBalance);
router.get('/rounds', getRounds);
router.get('/rounds/:roundId/bets', getRoundBets);

module.exports = router;
const User = require('../models/User');
const Round = require('../models/Round');
const Bet = require('../models/Bet');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBets = await Bet.countDocuments();
    const activeBets = await Bet.countDocuments({ status: 'active' });
    
    const volumeAgg = await Bet.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalVolume = volumeAgg[0]?.total || 0;

    const profitAgg = await Bet.aggregate([
      { $group: { _id: null, total: { $sum: '$profit' } } }
    ]);
    const totalProfit = profitAgg[0]?.total || 0;

    const recentRounds = await Round.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('roundId crashPoint status createdAt');

    res.json({
      totalUsers,
      totalBets,
      activeBets,
      totalVolume,
      totalProfit,
      recentRounds,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();

    res.json({
      users,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Adjust user balance
// @route   POST /api/admin/adjust-balance
// @access  Private/Admin
exports.adjustBalance = async (req, res) => {
  try {
    const { userId, amount, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance += amount;
    await user.save();

    // Optionally log the adjustment (you can create an AdminLog model)
    console.log(`Admin adjusted ${user.username} balance by ${amount}. Reason: ${reason}`);

    res.json({
      userId: user._id,
      username: user.username,
      newBalance: user.balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rounds (paginated)
// @route   GET /api/admin/rounds
// @access  Private/Admin
exports.getRounds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const rounds = await Round.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Round.countDocuments();

    res.json({
      rounds,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bets for a specific round
// @route   GET /api/admin/rounds/:roundId/bets
// @access  Private/Admin
exports.getRoundBets = async (req, res) => {
  try {
    const { roundId } = req.params;
    const bets = await Bet.find({ roundId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
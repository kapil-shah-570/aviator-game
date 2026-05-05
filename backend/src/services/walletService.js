const User = require('../models/User');
const Bet = require('../models/Bet');
const mongoose = require('mongoose');

class WalletService {
  async placeBet(userId, roundId, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const user = await User.findById(userId).session(session);
      if (!user) throw new Error('User not found');
      if (user.balance < amount) throw new Error('Insufficient balance');
      
      user.balance -= amount;
      await user.save({ session });
      
      const bet = new Bet({
        userId,
        roundId,
        amount,
        status: 'active'
      });
      await bet.save({ session });
      
      await session.commitTransaction();
      return { bet, newBalance: user.balance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  async cashOut(userId, roundId, multiplier) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const bet = await Bet.findOne({ userId, roundId, status: 'active' }).session(session);
      if (!bet) throw new Error('No active bet found');
      
      const profit = bet.amount * multiplier - bet.amount;
      bet.cashoutMultiplier = multiplier;
      bet.profit = profit;
      bet.status = 'cashed_out';
      await bet.save({ session });
      
      const user = await User.findById(userId).session(session);
      user.balance += bet.amount + profit;
      await user.save({ session });
      
      await session.commitTransaction();
      return { profit: bet.amount + profit, newBalance: user.balance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  async processCrash(roundId) {
    const bets = await Bet.find({ roundId, status: 'active' });
    for (const bet of bets) {
      bet.status = 'crashed';
      bet.profit = -bet.amount;
      await bet.save();
      // No refund - player loses entire bet
    }
  }
}

module.exports = new WalletService();
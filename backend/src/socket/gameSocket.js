const jwt = require('jsonwebtoken');
const User = require('../models/User');
const gameState = require('../services/gameState');
const walletService = require('../services/walletService');

module.exports = (io) => {
  gameState.setSocketIO(io);
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication required'));
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);
    
    // Send current game state
    socket.emit('game_state', {
      status: gameState.getStatus(),
      multiplier: gameState.getMultiplier()
    });
    
    socket.on('place_bet', async ({ amount }) => {
      if (gameState.getStatus() !== 'flying') {
        socket.emit('error', { message: 'Round not in progress' });
        return;
      }
      
      try {
        const { bet, newBalance } = await walletService.placeBet(
          socket.user._id,
          gameState.currentRound._id,
          amount
        );
        socket.emit('bet_placed', { betId: bet._id, amount, newBalance });
        // Also notify room that player bet (optional)
        io.emit('player_bet', { username: socket.user.username, amount });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    socket.on('cash_out', async () => {
      if (gameState.getStatus() !== 'flying') {
        socket.emit('error', { message: 'Cannot cash out now' });
        return;
      }
      
      try {
        const multiplier = gameState.getMultiplier();
        const { profit, newBalance } = await walletService.cashOut(
          socket.user._id,
          gameState.currentRound._id,
          multiplier
        );
        socket.emit('cashout_success', { multiplier, profit, newBalance });
        io.emit('player_cashout', { username: socket.user.username, multiplier });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
    
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};
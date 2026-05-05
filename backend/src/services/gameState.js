const Round = require('../models/Round');
const { generateCrashPoint, generateSeeds } = require('./crashLogic');
const walletService = require('./walletService');
const redis = require('../config/redis');

class GameState {
  constructor() {
    this.currentRound = null;
    this.multiplier = 1.0;
    this.status = 'waiting'; // waiting, flying, crashed
    this.timer = null;
    this.roundInterval = null;
    this.crashPoint = null;
    this.waitingTime = 5; // seconds before round starts
    this.roundDuration = 0; // will be determined by crash point
  }
  
  async init() {
    // Load any in-progress round from DB? Or just start fresh
    await this.startWaiting();
  }
  
  async startWaiting() {
    this.status = 'waiting';
    this.multiplier = 1.0;
    let countdown = this.waitingTime;
    
    // Emit waiting status to all clients via io (passed from socket handler)
    this.emitToAll('round_waiting', { countdown });
    
    const interval = setInterval(() => {
      countdown--;
      this.emitToAll('round_waiting', { countdown });
      if (countdown <= 0) {
        clearInterval(interval);
        this.startRound();
      }
    }, 1000);
  }
  
  async startRound() {
    // Create new round in DB
    const seeds = generateSeeds();
    const crashPoint = generateCrashPoint(seeds.serverSeed, seeds.clientSeed, seeds.nonce);
    
    const round = new Round({
      roundId: `round_${Date.now()}`,
      crashPoint,
      serverSeed: seeds.serverSeed,
      clientSeed: seeds.clientSeed,
      status: 'flying',
      startTime: new Date()
    });
    await round.save();
    
    this.currentRound = round;
    this.crashPoint = crashPoint;
    this.status = 'flying';
    this.multiplier = 1.0;
    
    this.emitToAll('round_started', { roundId: round._id, crashPoint: this.crashPoint });
    
    // Start multiplier tick
    const startTime = Date.now();
    const updateInterval = setInterval(async () => {
      if (this.status !== 'flying') {
        clearInterval(updateInterval);
        return;
      }
      
      const elapsed = (Date.now() - startTime) / 1000;
      // Multiplier grows exponentially: 1.00 -> 1.01, 1.02, ... but faster as time goes on
      // Simpler: multiplier = 1 + (elapsed * 0.1) but cap at crash point
      let newMultiplier = 1 + (elapsed * 0.1);
      newMultiplier = Math.min(newMultiplier, this.crashPoint);
      newMultiplier = Math.round(newMultiplier * 100) / 100;
      
      if (newMultiplier >= this.crashPoint) {
        // Crash!
        clearInterval(updateInterval);
        await this.crash();
      } else {
        this.multiplier = newMultiplier;
        this.emitToAll('multiplier_tick', { value: this.multiplier });
      }
    }, 100);
  }
  
  async crash() {
    this.status = 'crashed';
    this.multiplier = this.crashPoint;
    this.emitToAll('round_crashed', { crashAt: this.crashPoint });
    
    // Process all active bets as lost
    await walletService.processCrash(this.currentRound._id);
    
    // Update round in DB
    this.currentRound.status = 'crashed';
    this.currentRound.endTime = new Date();
    this.currentRound.multiplier = this.crashPoint;
    await this.currentRound.save();
    
    // Start next round after delay
    setTimeout(() => this.startWaiting(), 3000);
  }
  
  emitToAll(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
  
  setSocketIO(io) {
    this.io = io;
  }
  
  getMultiplier() {
    return this.multiplier;
  }
  
  getStatus() {
    return this.status;
  }
}

module.exports = new GameState();
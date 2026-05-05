import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import MultiplierDisplay from '../components/game/MultiplierDisplay';
import PlaneAnimation from '../components/game/PlaneAnimation';
import BetControls from '../components/game/BetControls';
import PlayerPanel from '../components/game/PlayerPanel';
import RoundHistory from '../components/game/RoundHistory';
import toast from 'react-hot-toast';

const Game = () => {
  const { user, setUser } = useAuth();
  const { isConnected, on, off, emit } = useSocket();
  const [status, setStatus] = useState('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [crashPoint, setCrashPoint] = useState(null);
  const [waitingCountdown, setWaitingCountdown] = useState(0);
  const [players, setPlayers] = useState([]);
  const [roundHistory, setRoundHistory] = useState([]);
  const [userBet, setUserBet] = useState(null);
  const [pendingBetAmount, setPendingBetAmount] = useState(null);
  
  useEffect(() => {
    if (!isConnected) return;
    
    on('round_waiting', ({ countdown }) => {
      setStatus('waiting');
      setWaitingCountdown(countdown);
      setCrashPoint(null);
    });
    
    on('round_started', ({ roundId, crashPoint }) => {
      setStatus('flying');
      setMultiplier(1.0);
      setCrashPoint(crashPoint);
      setUserBet(null);
    });
    
    on('multiplier_tick', ({ value }) => {
      setMultiplier(value);
    });
    
    on('round_crashed', ({ crashAt }) => {
      setStatus('crashed');
      setMultiplier(crashAt);
      toast.error(`Crashed at ${crashAt}x!`);
    });
    
    on('player_bet', ({ username, amount }) => {
      setPlayers(prev => [...prev, { username, amount }]);
    });
    
    on('player_cashout', ({ username, multiplier }) => {
      toast.success(`${username} cashed out at ${multiplier}x`);
      setPlayers(prev => prev.filter(p => p.username !== username));
    });
    
    on('bet_placed', ({ newBalance }) => {
      setUserBet({ amount: pendingBetAmount });
      setPendingBetAmount(null);
      setUser({ ...user, balance: newBalance });
      toast.success(`Bet placed!`);
    });
    
    on('cashout_success', ({ multiplier, profit, newBalance }) => {
      setUserBet(null);
      setUser({ ...user, balance: newBalance });
      toast.success(`Cashed out at ${multiplier}x! Profit: $${profit.toFixed(2)}`);
    });
    
    return () => {
      off('round_waiting');
      off('round_started');
      off('multiplier_tick');
      off('round_crashed');
      off('player_bet');
      off('player_cashout');
      off('bet_placed');
      off('cashout_success');
    };
  }, [isConnected, on, off]);
  
  const handlePlaceBet = (amount) => {
    if (status !== 'flying') {
      toast.error('Round not in progress');
      return;
    }
    if (amount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }
    setPendingBetAmount(amount);
    emit('place_bet', { amount });
  };
  
  const handleCashOut = () => {
    if (!userBet) {
      toast.error('No active bet');
      return;
    }
    emit('cash_out');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="muted-text">Balance</p>
          <p className="mt-2 text-3xl font-black text-yellow-400">${user?.balance ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="muted-text">Status</p>
          <p className="mt-2 text-3xl font-black capitalize text-white">{status}</p>
        </div>
        <div className="stat-card">
          <p className="muted-text">Current Bet</p>
          <p className="mt-2 text-3xl font-black text-emerald-400">
            {userBet ? `$${userBet.amount}` : 'None'}
          </p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div className="mb-8 text-center">
          {status === 'waiting' && (
            <div className="mb-4 text-sm uppercase tracking-[0.35em] text-yellow-300">Next round in {waitingCountdown}s</div>
          )}
          <MultiplierDisplay multiplier={multiplier} status={status} />
          <PlaneAnimation multiplier={multiplier} crashed={status === 'crashed'} />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <BetControls
            onPlaceBet={handlePlaceBet}
            onCashOut={handleCashOut}
            disabledCashout={!userBet}
            balance={user?.balance}
          />
          <PlayerPanel players={players} />
          <RoundHistory history={roundHistory} />
        </div>
      </div>
    </div>
  );
};

export default Game;

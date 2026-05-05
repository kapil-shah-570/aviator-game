import React, { useState } from 'react';

const BetControls = ({ onPlaceBet, onCashOut, disabledCashout, balance }) => {
  const [amount, setAmount] = useState(10);
  
  const presets = [5, 10, 25, 50, 100];
  
  return (
    <div className="surface p-5">
      <h3 className="text-xl font-black text-white">Bet Controls</h3>
      <p className="mt-1 text-sm text-slate-400">Pick an amount and place a bet during the flight phase.</p>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Bet Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="text-input"
            min="1"
            max={balance}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setAmount(p)}
              className="secondary-button px-3 py-2 text-sm"
            >
              ${p}
            </button>
          ))}
        </div>
        <button
          onClick={() => onPlaceBet(amount)}
          className="primary-button w-full"
        >
          Place Bet
        </button>
        <button
          onClick={onCashOut}
          disabled={disabledCashout}
          className={`w-full rounded-xl py-3 font-semibold transition ${
            disabledCashout
              ? 'cursor-not-allowed bg-white/5 text-slate-500'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          Cash Out
        </button>
      </div>
    </div>
  );
};

export default BetControls;

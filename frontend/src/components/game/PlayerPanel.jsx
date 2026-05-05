import React from 'react';

const PlayerPanel = ({ players }) => {
  return (
    <div className="surface p-5">
      <h3 className="text-xl font-black text-white">Active Players</h3>
      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
        {players.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No active bets yet</p>
        ) : (
          players.map((player, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="font-medium text-slate-100">{player.username}</span>
              <span className="font-semibold text-yellow-400">${player.amount}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerPanel;

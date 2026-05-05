import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoundHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/fairness/seeds?limit=15');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="surface p-5">
      <h3 className="text-xl font-black text-white">Round History</h3>
      <div className="mt-4 flex max-h-64 flex-wrap gap-2 overflow-y-auto">
        {history.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No rounds yet</p>
        ) : history.map((round) => (
          <div
            key={round._id}
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              round.crashPoint >= 2
                ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20'
                : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20'
            }`}
          >
            {round.crashPoint}x
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundHistory;

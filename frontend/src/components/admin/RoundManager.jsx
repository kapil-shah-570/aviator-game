import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoundManager = () => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRounds();
  }, [page]);

  const fetchRounds = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/rounds?page=${page}&limit=15`);
      setRounds(res.data.rounds);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const fetchRoundBets = async (roundId) => {
    try {
      const res = await axios.get(`/api/admin/rounds/${roundId}/bets`);
      setBets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const selectRound = (round) => {
    setSelectedRound(round);
    fetchRoundBets(round._id);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <p className="muted-text uppercase tracking-[0.35em]">Operations</p>
        <h2 className="mt-2 text-3xl font-black text-yellow-400">Round Management</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-panel p-5">
          <h3 className="text-xl font-black text-white">Rounds</h3>
          <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
            {rounds.map((round) => (
              <div
                key={round._id}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedRound?._id === round._id ? 'bg-yellow-400 text-slate-950' : 'bg-white/5 hover:bg-white/10 text-slate-200'
                }`}
                onClick={() => selectRound(round)}
              >
                <div className="flex justify-between">
                  <span>{round.roundId}</span>
                  <span>{round.crashPoint}x</span>
                </div>
                <div className="text-xs text-slate-400">{round.status}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p-1))}
              disabled={page === 1}
              className="secondary-button px-3 py-2 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="self-center text-sm text-slate-400">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p+1))}
              disabled={page === totalPages}
              className="secondary-button px-3 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        <div className="glass-panel p-5">
          <h3 className="text-xl font-black text-white">Bets in Round</h3>
          {selectedRound ? (
            bets.length > 0 ? (
              <div className="mt-4 max-h-96 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-slate-300">
                    <tr>
                      <th className="p-2 text-left">User</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Cashout</th>
                      <th className="p-2 text-left">Profit</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bets.map(bet => (
                      <tr key={bet._id} className="border-b border-white/10">
                        <td className="p-2">{bet.userId?.username || 'Unknown'}</td>
                        <td className="p-2">${bet.amount}</td>
                        <td className="p-2">{bet.cashoutMultiplier ? `${bet.cashoutMultiplier}x` : '-'}</td>
                        <td className={`p-2 ${bet.profit > 0 ? 'text-green-500' : bet.profit < 0 ? 'text-red-500' : ''}`}>
                          ${bet.profit}
                        </td>
                        <td className="p-2 capitalize">{bet.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">No bets in this round</p>
            )
          ) : (
            <p className="text-gray-400">Select a round to view bets</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundManager;

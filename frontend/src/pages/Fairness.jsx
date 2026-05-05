import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fairness = () => {
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    try {
      const res = await axios.get('/api/fairness/seeds?limit=20');
      setRounds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyRound = async (roundId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/fairness/verify/${roundId}`);
      setVerification(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <p className="muted-text uppercase tracking-[0.35em]">Security</p>
        <h1 className="mt-2 text-4xl font-black text-yellow-400">Provably Fair Verification</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Every round's crash point is generated using HMAC-SHA256 with a server seed and client seed.
          You can verify any past round using the seeds provided below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
          <h2 className="text-xl font-black text-white">Recent Rounds</h2>
          <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
            {rounds.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No rounds available yet</p>
            ) : rounds.map((round) => (
              <div
                key={round._id}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-yellow-400/30 hover:bg-white/8"
                onClick={() => {
                  setSelectedRound(round);
                  verifyRound(round._id);
                }}
              >
                <span className="text-white">{round.roundId}</span>
                <span className="font-semibold text-yellow-400">{round.crashPoint}x</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-5">
          <h2 className="text-xl font-black text-white">Verification Details</h2>
          {loading && <p className="mt-4 text-sm text-slate-400">Verifying...</p>}
          {verification && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="surface p-3">
                <span className="font-bold">Round ID:</span> {verification.roundId}
              </div>
              <div className="surface p-3">
                <span className="font-bold">Crash Point:</span> {verification.crashPoint}x
              </div>
              <div className="surface p-3">
                <span className="font-bold">Server Seed (revealed):</span>
                <code className="mt-2 block break-all rounded-xl bg-slate-950 p-3 text-xs text-slate-300">{verification.serverSeed}</code>
              </div>
              <div className="surface p-3">
                <span className="font-bold">Client Seed:</span>
                <code className="mt-2 block break-all rounded-xl bg-slate-950 p-3 text-xs text-slate-300">{verification.clientSeed}</code>
              </div>
              <div className="surface p-3">
                <span className="font-bold">Recalculated Crash:</span> {verification.recalculatedCrash}x
              </div>
              <div className={`rounded-2xl p-3 text-center font-bold ${verification.verified ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20' : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20'}`}>
                {verification.verified ? 'Verified - Crash point matches seeds' : 'Verification failed'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fairness;

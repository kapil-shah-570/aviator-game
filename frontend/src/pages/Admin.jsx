import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalBets: 0, totalVolume: 0, recentRounds: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  
  const chartData = {
    labels: stats.recentRounds.map(r => new Date(r.createdAt).toLocaleTimeString()),
    datasets: [
      { label: 'Crash Point', data: stats.recentRounds.map(r => r.crashPoint), borderColor: 'red' }
    ]
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <p className="muted-text uppercase tracking-[0.35em]">Admin</p>
        <h1 className="mt-2 text-4xl font-black text-yellow-400">Admin Dashboard</h1>
        <p className="mt-3 text-slate-300">Monitor platform activity and recent round performance.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="stat-card">
          <h3 className="muted-text">Total Users</h3>
          <p className="mt-2 text-3xl font-black text-white">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3 className="muted-text">Total Bets</h3>
          <p className="mt-2 text-3xl font-black text-white">{stats.totalBets}</p>
        </div>
        <div className="stat-card">
          <h3 className="muted-text">Total Volume</h3>
          <p className="mt-2 text-3xl font-black text-yellow-400">${stats.totalVolume.toFixed(2)}</p>
        </div>
      </div>
      <div className="glass-panel p-5">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Admin;

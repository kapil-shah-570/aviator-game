import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StatsDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBets: 0,
    activeBets: 0,
    totalVolume: 0,
    totalProfit: 0,
    recentRounds: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stats.recentRounds.map(r => new Date(r.createdAt).toLocaleTimeString()),
    datasets: [
      {
        label: 'Crash Point',
        data: stats.recentRounds.map(r => r.crashPoint),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: 'white' } },
      title: { display: true, text: 'Recent Crash Points', color: 'white' }
    },
    scales: { y: { ticks: { color: 'white' } }, x: { ticks: { color: 'white' } } }
  };

  if (loading) return <div className="text-slate-300">Loading stats...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="stat-card text-center">
          <h3 className="muted-text">Total Users</h3>
          <p className="mt-2 text-3xl font-black text-yellow-400">{stats.totalUsers}</p>
        </div>
        <div className="stat-card text-center">
          <h3 className="muted-text">Total Bets</h3>
          <p className="mt-2 text-3xl font-black text-yellow-400">{stats.totalBets}</p>
        </div>
        <div className="stat-card text-center">
          <h3 className="muted-text">Active Bets</h3>
          <p className="mt-2 text-3xl font-black text-yellow-400">{stats.activeBets}</p>
        </div>
        <div className="stat-card text-center">
          <h3 className="muted-text">Total Volume</h3>
          <p className="mt-2 text-3xl font-black text-yellow-400">${stats.totalVolume.toFixed(2)}</p>
        </div>
        <div className="stat-card text-center">
          <h3 className="muted-text">Platform Profit</h3>
          <p className="mt-2 text-3xl font-black text-emerald-400">${stats.totalProfit.toFixed(2)}</p>
        </div>
      </div>
      <div className="glass-panel p-5">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default StatsDashboard;

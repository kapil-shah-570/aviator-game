import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) navigate('/game');
  };

  return (
    <div className="glass-panel mx-auto w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <p className="muted-text uppercase tracking-[0.35em]">Welcome back</p>
        <h2 className="mt-2 text-4xl font-black text-yellow-400">Login</h2>
        <p className="mt-2 text-sm text-slate-400">Sign in to continue your session.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-input"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-input"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="primary-button w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-yellow-400 hover:text-yellow-300">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;

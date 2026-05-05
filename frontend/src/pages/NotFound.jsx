import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="glass-panel mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-8 py-12 text-center">
      <p className="muted-text uppercase tracking-[0.35em]">Lost route</p>
      <h1 className="mt-4 text-8xl font-black text-yellow-400">404</h1>
      <h2 className="mt-2 text-3xl text-white">Page Not Found</h2>
      <p className="mt-4 max-w-md text-slate-400">The page you're looking for doesn't exist.</p>
      <Link to="/game" className="primary-button mt-8">
        Go to Game
      </Link>
    </div>
  );
};

export default NotFound;

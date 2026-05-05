import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/game" className="flex items-center gap-3 text-xl font-black tracking-[0.25em] text-yellow-400 uppercase">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-300 shadow-lg shadow-yellow-500/10">
            A
          </span>
          <span>Aviator</span>
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          {user && (
            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 md:block">
              {user.username}
            </div>
          )}
          {user && (
            <button onClick={logout} className="secondary-button">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isAdmin }) => {
  const links = isAdmin ? [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/rounds', label: 'Rounds', icon: '🎲' },
    { to: '/admin/users', label: 'Users', icon: '👥' },
    { to: '/fairness', label: 'Fairness', icon: '🔒' }
  ] : [
    { to: '/game', label: 'Game', icon: '🎮' },
    { to: '/history', label: 'History', icon: '📜' },
    { to: '/fairness', label: 'Fairness', icon: '🔒' },
    { to: '/profile', label: 'Profile', icon: '👤' }
  ];
  
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl lg:block">
      <div className="p-4 space-y-2">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { useApp } from '../context/AppContext';

const Navbar: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="bg-primary text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <i className="fas fa-building text-white text-sm"></i>
          </div>
          <h1 className="font-bold text-lg tracking-tight">Jobs France</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700">
            <i className="fas fa-wallet text-accent text-xs"></i>
            <span className="font-mono font-bold text-sm">{user.balance.toLocaleString()} F</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
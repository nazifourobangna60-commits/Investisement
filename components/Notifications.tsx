import React from 'react';
import { useApp } from '../context/AppContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {notifications.map((note) => (
        <div
          key={note.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl transform transition-all animate-fade-in-down w-full max-w-sm
            ${note.type === 'success' ? 'bg-green-500 text-white' : 
              note.type === 'error' ? 'bg-red-500 text-white' : 
              'bg-blue-600 text-white'}`}
          onClick={() => removeNotification(note.id)}
        >
          <div className="shrink-0">
            {note.type === 'success' && <i className="fas fa-check-circle text-lg"></i>}
            {note.type === 'error' && <i className="fas fa-exclamation-circle text-lg"></i>}
            {note.type === 'info' && <i className="fas fa-info-circle text-lg"></i>}
          </div>
          <p className="text-sm font-semibold flex-1">{note.message}</p>
          <button onClick={(e) => { e.stopPropagation(); removeNotification(note.id); }} className="opacity-70 hover:opacity-100">
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
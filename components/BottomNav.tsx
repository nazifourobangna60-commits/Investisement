import React from 'react';

interface BottomNavProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: 'home', icon: 'fa-house', label: 'Accueil' },
    { id: 'invest', icon: 'fa-city', label: 'Investir' },
    { id: 'wallet', icon: 'fa-wallet', label: 'Portefeuille' },
    { id: 'profile', icon: 'fa-user', label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              currentTab === item.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <i className={`fas ${item.icon} text-lg ${currentTab === item.id ? 'transform scale-110' : ''}`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
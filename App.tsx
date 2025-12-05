import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import AiChat from './components/AiChat';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Invest from './pages/Invest';
import Wallet from './pages/Wallet';
import Notifications from './components/Notifications';

// Component to handle authenticated views
const AuthenticatedApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const { user, simulateReferral, logout } = useApp();
  const [copied, setCopied] = useState(false);

  const copyRefLink = () => {
    // In a real app we would copy to clipboard
    // navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    // Logic specifically for WhatsApp as requested
    const shareText = `Salut ! Inscris-toi sur Jobs France avec mon code parrain *${user?.referralCode}* et gagne de l'argent ! 🚀\n\nRejoins-nous ici :`;
    const url = window.location.href;
    const fullMessage = `${shareText} ${url}`;
    
    // Generate WhatsApp URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    
    // Open in new tab/window (triggers WhatsApp App or Web)
    window.open(whatsappUrl, '_blank');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <Dashboard setTab={setCurrentTab} />;
      case 'invest': return <Invest />;
      case 'wallet': return <Wallet />;
      case 'profile':
        return (
            <div className="p-6 max-w-md mx-auto text-center pb-24">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-gray-400 border-4 border-white shadow-lg relative">
                    <i className="fas fa-user"></i>
                    <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-500 text-sm mb-1">@{user?.username}</p>
                <p className="text-gray-400 text-xs mb-6">{user?.phone}</p>

                {/* Referral Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1"><i className="fas fa-gift mr-2 text-yellow-300"></i>Programme Parrainage</h3>
                        <p className="text-purple-200 text-xs mb-4">Invitez vos amis et gagnez 500 FCFA par inscription !</p>
                        
                        <div className="bg-black/20 rounded-lg p-3 flex justify-between items-center mb-3 border border-white/10">
                            <code className="font-mono text-sm tracking-widest text-yellow-300">{user?.referralCode}</code>
                            <button onClick={copyRefLink} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition">
                                {copied ? 'Copié !' : 'Copier'}
                            </button>
                        </div>

                        <button 
                            onClick={handleShare}
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center mb-4"
                        >
                            <i className="fab fa-whatsapp mr-2 text-xl"></i> Inviter via WhatsApp
                        </button>

                        <div className="flex gap-4 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-xs text-purple-300 uppercase">Invités</p>
                                <p className="font-bold text-xl">{user?.referralCount || 0}</p>
                            </div>
                            <div>
                                <p className="text-xs text-purple-300 uppercase">Gains</p>
                                <p className="font-bold text-xl">{user?.referralEarnings || 0} F</p>
                            </div>
                        </div>

                        {/* Simulation Button for Demo */}
                        <button 
                            onClick={simulateReferral}
                            className="mt-4 w-full bg-white/10 hover:bg-white/20 text-xs py-2 rounded-lg border border-white/20 transition dashed-border"
                        >
                            <i className="fas fa-flask mr-1"></i> Simuler une invitation réussie (+500F)
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-4 shadow-lg mb-6 flex items-center justify-between text-left">
                    <div>
                        <h3 className="font-bold text-sm">Application Mobile</h3>
                        <p className="text-xs text-gray-400">Télécharger la version Android</p>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                        <i className="fab fa-android"></i>
                    </button>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm mb-6 text-left border border-gray-100">
                    <h3 className="text-sm font-bold mb-2">Informations légales</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Jobs France est une plateforme d'investissement. 
                        Les retraits sont soumis à validation par l'administration (accord signé).
                    </p>
                </div>

                <button 
                    onClick={logout} 
                    className="text-red-500 font-medium text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                    Se déconnecter
                </button>
            </div>
        );
      default: return <Dashboard setTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Notifications />
      <Navbar />
      <main className="pt-2">
        {renderContent()}
      </main>
      <AiChat />
      <BottomNav currentTab={currentTab} setTab={setCurrentTab} />
    </div>
  );
};

const Main: React.FC = () => {
  const { isAuthenticated } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isAuthenticated) {
    return (
        <>
            <Notifications />
            <Login onSwitch={() => setIsRegistering(!isRegistering)} isRegistering={isRegistering} />
        </>
    );
  }

  return <AuthenticatedApp />;
};

export default function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}
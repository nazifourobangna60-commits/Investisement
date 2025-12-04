import React from 'react';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC<{ setTab: (t: string) => void }> = ({ setTab }) => {
  const { user, myInvestments, timeUntilNextClaim, canClaim, claimEarnings } = useApp();

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) return "0h 0m 0s";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const potentialEarnings = myInvestments.reduce((sum, plan) => sum + plan.incomePerInterval, 0);

  return (
    <div className="pb-24 max-w-md mx-auto">
      {/* App Download Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
            <i className="fab fa-android text-green-400 text-2xl"></i>
            <div>
                <p className="font-bold text-sm">Application Android</p>
                <p className="text-[10px] text-gray-400">Installez pour un accès rapide</p>
            </div>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-colors shadow-lg">
            Télécharger
        </button>
      </div>

      {/* Balance Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-primary via-blue-800 to-blue-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <p className="text-blue-200 text-sm font-medium">Solde disponible</p>
          <h2 className="text-4xl font-bold mt-1 tracking-tight">{user?.balance.toLocaleString()} FCFA</h2>
          
          <div className="mt-6 flex gap-3">
            <button onClick={() => setTab('wallet')} className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/30 transition flex items-center justify-center">
              <i className="fas fa-plus mr-2"></i> Dépôt
            </button>
            <button onClick={() => setTab('wallet')} className="flex-1 bg-accent text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:bg-yellow-600 transition flex items-center justify-center">
              <i className="fas fa-arrow-down mr-2"></i> Retrait
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Updated for attractiveness */}
      <div className="px-4 grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-white to-purple-50 p-4 rounded-xl shadow-sm border border-purple-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full blur-xl -mr-8 -mt-8 opacity-50"></div>
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-600 mb-3 shadow-sm border border-purple-100 z-10">
            <i className="fas fa-city"></i>
          </div>
          <div className="z-10">
            <p className="text-xs text-purple-900 font-bold uppercase tracking-wide">Biens possédés</p>
            <p className="text-2xl font-bold text-gray-800">{myInvestments.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-sm border border-orange-100 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100 rounded-full blur-xl -mr-8 -mt-8 opacity-50"></div>
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-600 mb-3 shadow-sm border border-orange-100 z-10">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="z-10">
            <p className="text-xs text-orange-900 font-bold uppercase tracking-wide">Total investi</p>
            <p className="text-2xl font-bold text-gray-800">{user?.investedAmount.toLocaleString()} F</p>
          </div>
        </div>
      </div>

      {/* Claim Section */}
      <div className="px-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Revenus Automatiques</h3>
              <p className="text-xs text-gray-500">Collecte toutes les 5 heures</p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${canClaim ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
              <i className="fas fa-clock"></i>
            </div>
          </div>

          <div className="text-center py-5 bg-gray-50 rounded-xl border border-gray-100 mb-4">
             {myInvestments.length === 0 ? (
                 <div className="py-2">
                     <p className="text-gray-500 text-sm mb-2">Aucun investissement actif.</p>
                     <button onClick={() => setTab('invest')} className="text-primary text-sm font-bold underline">Commencer à investir</button>
                 </div>
             ) : (
                <>
                    <p className="text-gray-500 text-xs uppercase tracking-wide font-bold mb-1">Prochain gain dans</p>
                    <p className={`text-3xl font-mono font-bold tracking-tight ${canClaim ? 'text-green-500' : 'text-primary'}`}>
                    {canClaim ? 'DISPONIBLE' : formatTime(timeUntilNextClaim)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Montant à récupérer: <span className="text-gray-800 font-bold bg-white px-2 py-0.5 rounded shadow-sm border">{potentialEarnings} F</span>
                    </p>
                </>
             )}
          </div>

          <button
            onClick={claimEarnings}
            disabled={!canClaim}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center ${
              canClaim 
                ? 'bg-gradient-to-r from-success to-green-600 hover:shadow-lg transform active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {canClaim ? <><i className="fas fa-hand-holding-dollar mr-2"></i> Récupérer mes gains</> : 'En attente...'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
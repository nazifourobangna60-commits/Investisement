import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INVESTMENT_PLANS } from '../constants';
import { InvestmentPlan } from '../types';

const Invest: React.FC = () => {
  const { invest, user } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const handleInvestClick = (plan: InvestmentPlan) => {
    if ((user?.balance || 0) < plan.price) {
      alert("Solde insuffisant. Veuillez recharger votre compte.");
      return;
    }
    setSelectedPlan(plan);
  };

  const confirmInvest = () => {
    if (selectedPlan) {
      invest(selectedPlan);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-4 relative">
      {/* Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs md:max-w-sm shadow-2xl transform transition-all scale-100 animate-fade-in-down">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                <i className="fas fa-building text-primary text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmer l'achat</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Voulez-vous investir dans <br/>
                <span className="font-bold text-gray-800 text-base">"{selectedPlan.name}"</span> ?
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3 border border-gray-100">
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500">Prix de l'investissement</span>
                <span className="font-bold text-gray-900">{selectedPlan.price.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between text-sm items-center bg-green-50 p-2 rounded-lg border border-green-100">
                <span className="text-green-700 font-bold flex items-center"><i className="fas fa-gift mr-2"></i>Bonus immédiat</span>
                <span className="font-bold text-green-700">+{selectedPlan.bonus} F</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-700 text-sm">Coût final</span>
                <span className="font-bold text-primary text-lg">{(selectedPlan.price).toLocaleString()} F</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm"
              >
                Annuler
              </button>
              <button 
                onClick={confirmInvest}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-blue-700 hover:shadow-lg transform active:scale-95 transition-all text-sm"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-primary w-1 h-6 rounded-full mr-3"></span>
        Marché Immobilier
      </h2>
      
      <div className="space-y-5">
        {INVESTMENT_PLANS.map((plan) => (
          <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-32 bg-gray-200 relative group">
              <img src={plan.imageUrl} alt={plan.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
              
              {/* Badge Image */}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-green-100">
                <i className="fas fa-gift"></i> +{plan.bonus} F
              </div>

              <div className="absolute bottom-3 left-3 text-white">
                 <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest bg-black/30 w-fit px-2 py-0.5 rounded mb-1 backdrop-blur-sm">Immobilier</p>
                 <h3 className="font-bold text-lg leading-tight shadow-black drop-shadow-md">{plan.name}</h3>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                   <span className="text-xs text-gray-400 font-medium uppercase mb-1">Prix d'achat</span>
                   <span className="text-gray-900 font-extrabold text-2xl tracking-tight">{plan.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">FCFA</span></span>
                </div>
                <div className="text-right bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <span className="text-[10px] text-blue-400 font-bold uppercase block mb-0.5">Revenu estimé</span>
                    <div className="flex items-center justify-end font-bold text-blue-800">
                        {plan.incomePerInterval} F <span className="text-blue-400 font-medium text-xs ml-1">/5h</span>
                    </div>
                </div>
              </div>

              {/* Enhanced Bonus Display Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-green-100 opacity-50 transform rotate-12">
                   <i className="fas fa-gift text-4xl"></i>
                </div>
                <div className="flex items-center gap-2 z-10">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                        <i className="fas fa-gift text-xs"></i>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Bonus immédiat</span>
                        <span className="text-[10px] text-green-600 leading-none">Offert à l'achat</span>
                    </div>
                </div>
                <span className="font-extrabold text-green-600 text-lg z-10">+{plan.bonus} FCFA</span>
              </div>

              <button
                onClick={() => handleInvestClick(plan)}
                className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition-all flex justify-center items-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10">Investir maintenant</span>
                <i className="fas fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform relative z-10"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Invest;
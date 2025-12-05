import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, Transaction } from '../types';
import { ADMIN_EMAIL } from '../constants';

const Wallet: React.FC = () => {
  const { user, deposit, withdraw, transactions } = useApp();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.MIX);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  // Form states
  const [depositPhone, setDepositPhone] = useState('');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [password, setPassword] = useState('');

  const generatePaymentLink = () => {
    if (!amount) {
        setStatusMsg("Veuillez entrer un montant.");
        return;
    }
    setLoading(true);
    // Simulation de génération de lien accélérée
    setTimeout(() => {
        const uniqueId = Math.random().toString(36).substring(7);
        setPaymentLink(`https://pay.jobsfrance.app/secure/${uniqueId}?amt=${amount}`);
        setStatusMsg("Lien généré avec succès. Cliquez ci-dessous pour payer.");
        setLoading(false);
    }, 600);
  };

  const simulatePaymentClick = async () => {
    setLoading(true);
    setStatusMsg("Traitement du paiement via le lien sécurisé...");
    setTimeout(async () => {
         const success = await deposit(Number(amount), PaymentMethod.LINK);
         if (success) {
             setStatusMsg("Paiement reçu ! En attente de validation admin...");
             setAmount('');
             setDepositPhone('');
             setPaymentLink('');
             setActiveTab('history'); // Rediriger vers l'historique
         }
         setLoading(false);
    }, 1000);
  };

  const handleDeposit = async () => {
    if (!amount || !depositPhone) {
        setStatusMsg("Veuillez entrer le montant et votre numéro.");
        return;
    }
    setLoading(true);
    setStatusMsg("Envoi de la demande de paiement (Push)... Veuillez valider sur votre téléphone.");
    
    // Simulate payment gateway experience (Push USSD)
    const success = await deposit(Number(amount), method);
    
    if (success) {
        setStatusMsg("Transaction initiée. L'argent apparaîtra après confirmation de l'administration.");
        setAmount('');
        setDepositPhone('');
        setTimeout(() => setActiveTab('history'), 800); // Rediriger vers l'historique rapidement
    } else {
        setStatusMsg("Erreur ou annulation de la transaction.");
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || !withdrawPhone || !password) {
        setStatusMsg("Veuillez remplir tous les champs (Montant, Numéro, Mot de passe).");
        return;
    }
    setLoading(true);
    setStatusMsg("Traitement de la demande...");
    
    // Passing phone number as details
    const result = await withdraw(Number(amount), method, `Num: ${withdrawPhone}`);
    
    if (result === "SUCCESS") {
        setStatusMsg(`Demande envoyée ! Un email de validation a été envoyé à l'administrateur (${ADMIN_EMAIL}). Le retrait sera effectif après validation mensuelle.`);
        setAmount('');
        setWithdrawPhone('');
        setPassword('');
        setTimeout(() => setActiveTab('history'), 1000); // Rediriger vers l'historique
    } else {
        setStatusMsg(result);
    }
    setLoading(false);
  };

  // Helper pour l'affichage de l'historique
  const getTxDetails = (tx: Transaction) => {
    switch(tx.type) {
        case 'DEPOSIT':
            return { icon: 'fa-arrow-down', color: 'text-green-600', bg: 'bg-green-100', label: 'Dépôt', sign: '+' };
        case 'WITHDRAWAL':
            return { icon: 'fa-arrow-up', color: 'text-red-600', bg: 'bg-red-100', label: 'Retrait', sign: '-' };
        case 'EARNING':
            return { icon: 'fa-coins', color: 'text-blue-600', bg: 'bg-blue-100', label: 'Revenus', sign: '+' };
        case 'BONUS':
            return { icon: 'fa-gift', color: 'text-purple-600', bg: 'bg-purple-100', label: 'Bonus', sign: '+' };
        case 'REFERRAL':
            return { icon: 'fa-users', color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Parrainage', sign: '+' };
        default:
            return { icon: 'fa-circle', color: 'text-gray-600', bg: 'bg-gray-100', label: 'Autre', sign: '' };
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="pb-24 max-w-md mx-auto px-4 pt-4">
      {/* Toggle */}
      <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
        <button
          onClick={() => { setActiveTab('deposit'); setStatusMsg(''); setPaymentLink(''); }}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'deposit' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          Dépôt
        </button>
        <button
          onClick={() => { setActiveTab('withdraw'); setStatusMsg(''); setPaymentLink(''); }}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'withdraw' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          Retrait
        </button>
        <button
          onClick={() => { setActiveTab('history'); setStatusMsg(''); setPaymentLink(''); }}
          className={`flex-1 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
        >
          Historique
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
        
        {/* TITRE */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {activeTab === 'deposit' && 'Recharger le compte'}
          {activeTab === 'withdraw' && 'Demander un retrait'}
          {activeTab === 'history' && 'Historique des transactions'}
        </h3>

        {/* CONTENU : DEPOT */}
        {activeTab === 'deposit' && (
          <div className="animate-fade-in">
            {/* Inputs First for Deposit */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Montant (FCFA)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!!paymentLink}
                  className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-primary focus:outline-none py-2 bg-transparent"
                  placeholder="0"
                />
              </div>

              {method !== PaymentMethod.LINK && (
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Votre numéro de téléphone</label>
                    <input
                        type="tel"
                        value={depositPhone}
                        onChange={(e) => setDepositPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Pour valider la transaction (Push)"
                    />
                </div>
              )}
            </div>

            {/* Method Selection */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Choisir le moyen de paiement</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setMethod(PaymentMethod.MIX); setPaymentLink(''); }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${method === PaymentMethod.MIX ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200'}`}
                >
                  <i className="fas fa-mobile-alt text-lg mb-1"></i>
                  <span className="text-[10px] font-bold">Mix By Yas</span>
                </button>
                <button
                  onClick={() => { setMethod(PaymentMethod.FLOOZ); setPaymentLink(''); }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${method === PaymentMethod.FLOOZ ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200'}`}
                >
                  <i className="fas fa-wifi text-lg mb-1"></i>
                  <span className="text-[10px] font-bold">Flooz</span>
                </button>
                <button
                  onClick={() => { setMethod(PaymentMethod.LINK); setPaymentLink(''); }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${method === PaymentMethod.LINK ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200'}`}
                >
                  <i className="fas fa-link text-lg mb-1"></i>
                  <span className="text-[10px] font-bold text-center leading-tight">Lien Web</span>
                </button>
              </div>
            </div>

            {/* ACTION BUTTON */}
            {method === PaymentMethod.LINK ? (
                !paymentLink ? (
                    <button
                        onClick={generatePaymentLink}
                        disabled={loading || !amount}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all mb-4"
                    >
                        {loading ? 'Génération...' : 'Générer le lien de paiement'}
                    </button>
                ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center animate-fade-in mb-4">
                        <p className="text-green-800 text-xs font-bold mb-2">Lien généré !</p>
                        <button 
                            onClick={simulatePaymentClick}
                            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-green-700 transition"
                        >
                            <i className="fas fa-external-link-alt mr-2"></i> Payer maintenant
                        </button>
                    </div>
                )
            ) : (
                <button
                    onClick={handleDeposit}
                    disabled={loading || !amount || !depositPhone}
                    className="w-full bg-gradient-to-r from-primary to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all mb-4"
                >
                    {loading ? 'Attente de confirmation...' : 'Initier le dépôt'}
                </button>
            )}

             {/* Security Info */}
             {method !== PaymentMethod.LINK && (
                <p className="text-[10px] text-gray-400 italic text-center">
                    <i className="fas fa-lock mr-1"></i> Transaction sécurisée. Les fonds vont vers le compte marchand.
                </p>
             )}
          </div>
        )}

        {/* CONTENU : RETRAIT */}
        {activeTab === 'withdraw' && (
          <div className="animate-fade-in">
             <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Montant à retirer</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-2xl font-bold border-b-2 border-gray-200 focus:border-primary focus:outline-none py-2 bg-transparent"
                  placeholder="0"
                />
              </div>

               <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Numéro de réception</label>
                <input
                    type="tel"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Numéro pour recevoir l'argent"
                />
               </div>

               <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Votre mot de passe</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Confirmation de sécurité"
                />
               </div>
            </div>

             {/* Method Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-500 mb-2">Recevoir sur</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod(PaymentMethod.MIX)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${method === PaymentMethod.MIX ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200'}`}
                >
                  <i className="fas fa-mobile-alt text-lg mb-1"></i>
                  <span className="text-[10px] font-bold">Mix By Yas</span>
                </button>
                <button
                  onClick={() => setMethod(PaymentMethod.FLOOZ)}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${method === PaymentMethod.FLOOZ ? 'border-primary bg-blue-50 text-primary ring-1 ring-primary' : 'border-gray-200'}`}
                >
                  <i className="fas fa-wifi text-lg mb-1"></i>
                  <span className="text-[10px] font-bold">Flooz</span>
                </button>
              </div>
            </div>

            <button
                onClick={handleWithdraw}
                disabled={loading || !amount || !withdrawPhone || !password}
                className="w-full bg-accent text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all mb-4"
            >
                {loading ? 'Traitement...' : 'Demander le retrait'}
            </button>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-[10px] text-yellow-800">
                <p><strong>Note importante :</strong> Les retraits sont traités mensuellement. Une validation admin est requise par email.</p>
            </div>
          </div>
        )}

        {/* CONTENU : HISTORIQUE */}
        {activeTab === 'history' && (
           <div className="animate-fade-in flex flex-col h-full">
                {transactions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-60">
                        <i className="fas fa-history text-4xl text-gray-300 mb-3"></i>
                        <p className="text-sm text-gray-400">Aucune transaction pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx) => {
                            const info = getTxDetails(tx);
                            return (
                                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${info.bg} ${info.color}`}>
                                            <i className={`fas ${info.icon}`}></i>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-800">{info.label}</p>
                                            <p className="text-[10px] text-gray-400">{formatDate(tx.date)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${tx.type === 'WITHDRAWAL' ? 'text-gray-800' : 'text-green-600'}`}>
                                            {info.sign}{tx.amount.toLocaleString()} F
                                        </p>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                            tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            tx.status === 'WAITING_ADMIN' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                            {tx.status === 'WAITING_ADMIN' ? 'En attente' : 
                                             tx.status === 'COMPLETED' ? 'Succès' : tx.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
           </div>
        )}

        {/* Message d'état (Erreur/Succès) pour Dépôt/Retrait */}
        {activeTab !== 'history' && statusMsg && (
            <div className={`mt-4 p-3 rounded-lg text-xs font-medium text-center ${statusMsg.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
                {statusMsg}
            </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
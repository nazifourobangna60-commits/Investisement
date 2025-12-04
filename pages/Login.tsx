import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface LoginProps {
  onSwitch: () => void;
  isRegistering: boolean;
}

const Login: React.FC<LoginProps> = ({ onSwitch, isRegistering }) => {
  const { login, register } = useApp();
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [username, setUsername] = useState(''); // Pseudo
  const [phone, setPhone] = useState('');
  
  // Registration specific fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (isRegistering) {
        // Registration Logic
        register({
            username,
            firstName,
            lastName,
            dob,
            email,
            phone
        });
        // Feedback visuel (dans une vraie app, on attendrait la réponse backend)
        alert("Inscription réussie ! Un email de confirmation a été envoyé à l'administration.");
      } else {
        // Login Logic
        login(username, phone);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/10 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>
      
      <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-auto w-full max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center mb-3 shadow-lg transform rotate-3">
            <i className="fas fa-building text-white text-xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{isRegistering ? "Créer un compte" : "Bienvenue"}</h2>
          <p className="text-gray-500 text-xs mt-1">
            {isRegistering ? "Rejoignez Jobs France et commencez à investir" : "Connectez-vous à Jobs France"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Common Fields */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Nom d'utilisateur (Pseudo)</label>
            <div className="relative">
              <i className="fas fa-user-tag absolute left-3 top-2.5 text-gray-400 text-xs"></i>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                placeholder="Votre pseudo"
              />
            </div>
          </div>

          {isRegistering && (
              <>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Nom</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                            placeholder="Nom"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Prénom</label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                            placeholder="Prénom"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Date de naissance</label>
                    <div className="relative">
                        <i className="fas fa-calendar absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        <input
                            type="date"
                            required
                            value={dob}
                            onChange={e => setDob(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Email</label>
                    <div className="relative">
                        <i className="fas fa-envelope absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                            placeholder="exemple@email.com"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Un email de confirmation sera envoyé à l'admin.</p>
                </div>
              </>
          )}
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase">Numéro de téléphone</label>
            <div className="relative">
              <i className="fas fa-phone absolute left-3 top-2.5 text-gray-400 text-xs"></i>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
                placeholder="Ex: 90000000"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform active:scale-95 transition-all mt-4"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : (isRegistering ? "Confirmer l'inscription" : "Se connecter")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {isRegistering ? "Déjà un compte ?" : "Pas encore de compte ?"} {' '}
            <button onClick={onSwitch} className="text-secondary font-bold hover:underline">
              {isRegistering ? "Se connecter" : "S'inscrire"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
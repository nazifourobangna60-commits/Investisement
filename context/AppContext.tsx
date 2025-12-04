import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, InvestmentPlan, AppNotification, NotificationType } from '../types';
import { EARNING_INTERVAL_MS, MIN_WITHDRAWAL, ADMIN_EMAIL, MERCHANT_NUMBERS } from '../constants';

interface RegisterData {
  username: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phone: string;
}

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  myInvestments: InvestmentPlan[];
  notifications: AppNotification[];
  login: (username: string, phone: string) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  deposit: (amount: number, method: string) => Promise<boolean>;
  withdraw: (amount: number, method: string, details: string) => Promise<string>;
  invest: (plan: InvestmentPlan) => boolean;
  canClaim: boolean;
  claimEarnings: () => void;
  timeUntilNextClaim: number;
  simulateReferral: () => void;
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [myInvestments, setMyInvestments] = useState<InvestmentPlan[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Timer state
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<number>(0);

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('jf_user');
    const storedInvestments = localStorage.getItem('jf_investments');
    const storedTransactions = localStorage.getItem('jf_transactions');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedInvestments) setMyInvestments(JSON.parse(storedInvestments));
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
  }, []);

  // Save changes
  useEffect(() => {
    if (user) localStorage.setItem('jf_user', JSON.stringify(user));
    localStorage.setItem('jf_investments', JSON.stringify(myInvestments));
    localStorage.setItem('jf_transactions', JSON.stringify(transactions));
  }, [user, myInvestments, transactions]);

  // Earnings Timer Logic
  useEffect(() => {
    if (!user || myInvestments.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - user.lastClaimTime;
      const remaining = Math.max(0, EARNING_INTERVAL_MS - elapsed);
      setTimeUntilNextClaim(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [user, myInvestments]);

  const addNotification = (type: NotificationType, message: string) => {
    const id = Date.now().toString() + Math.random();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const login = (username: string, phone: string) => {
    // Simulation simple de login
    const newUser: User = {
      username,
      phone,
      balance: 0,
      investedAmount: 0,
      lastClaimTime: Date.now(),
      referralCode: username.toUpperCase() + Math.floor(Math.random() * 1000),
      referralCount: 0,
      referralEarnings: 0
    };
    setUser(newUser);
    addNotification('success', `Bon retour, ${username} !`);
  };

  const register = (data: RegisterData) => {
    // Simulation d'envoi d'email à l'administrateur
    console.log(`[SYSTEM EMAIL] Envoi de confirmation d'inscription à ${ADMIN_EMAIL}`);
    console.log(`[SYSTEM DATA] Nouvel utilisateur : ${data.firstName} ${data.lastName}, Tel: ${data.phone}`);

    const newUser: User = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      email: data.email,
      phone: data.phone,
      balance: 0,
      investedAmount: 0,
      lastClaimTime: Date.now(),
      referralCode: data.username.slice(0, 3).toUpperCase() + Date.now().toString().slice(-4),
      referralCount: 0,
      referralEarnings: 0
    };
    setUser(newUser);
    addNotification('success', 'Compte créé avec succès !');
  };

  const logout = () => {
    setUser(null);
    setMyInvestments([]);
    setTransactions([]);
    localStorage.removeItem('jf_user');
    localStorage.removeItem('jf_investments');
    localStorage.removeItem('jf_transactions');
    addNotification('info', 'Déconnexion réussie.');
  };

  const deposit = async (amount: number, method: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // 1. Simulation du transfert vers les numéros sécurisés
      const targetNumber = method.includes('Flooz') ? MERCHANT_NUMBERS.FLOOZ : MERCHANT_NUMBERS.MIX;
      console.log(`[SECURE TRANSFER] Initiation du dépôt de ${amount} vers le compte sécurisé (Masked: ${targetNumber})`);
      
      // 2. Délai pour simuler la validation administrateur
      setTimeout(() => {
        if (!user) {
            resolve(false); 
            return;
        }
        
        console.log(`[ADMIN CONFIRMATION] Dépôt de ${amount} validé par l'admin. Crédit du compte virtuel.`);

        const newTx: Transaction = {
          id: Date.now().toString(),
          type: 'DEPOSIT',
          amount,
          date: Date.now(),
          status: 'COMPLETED',
          method: method as any
        };
        setTransactions(prev => [newTx, ...prev]);
        setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
        addNotification('success', `Dépôt de ${amount.toLocaleString()} F reçu et validé !`);
        resolve(true);
      }, 4000); // Délai de 4 secondes pour simuler la vérification
    });
  };

  const withdraw = async (amount: number, method: string, details: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!user) return resolve("Erreur utilisateur");
        if (amount < MIN_WITHDRAWAL) {
            addNotification('error', `Minimum de retrait : ${MIN_WITHDRAWAL} FCFA`);
            return resolve(`Minimum de retrait : ${MIN_WITHDRAWAL} FCFA`);
        }
        if (user.balance < amount) {
            addNotification('error', "Solde insuffisant pour ce retrait.");
            return resolve("Solde insuffisant");
        }

        // Simulation sending email logic
        console.log(`[SIMULATION] Email envoyé à ${ADMIN_EMAIL} pour valider le retrait de ${amount}F vers ${details}`);

        const newTx: Transaction = {
          id: Date.now().toString(),
          type: 'WITHDRAWAL',
          amount,
          date: Date.now(),
          status: 'WAITING_ADMIN', // New status
          method: method as any,
          details
        };
        setTransactions(prev => [newTx, ...prev]);
        setUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
        addNotification('success', "Demande de retrait envoyée à l'administration.");
        resolve("SUCCESS");
      }, 1500);
    });
  };

  const invest = (plan: InvestmentPlan) => {
    if (!user || user.balance < plan.price) {
        addNotification('error', "Solde insuffisant pour cet investissement.");
        return false;
    }

    // Deduct cost
    const newTxBuy: Transaction = {
      id: Date.now().toString() + '_buy',
      type: 'WITHDRAWAL', // Spending balance
      amount: plan.price,
      date: Date.now(),
      status: 'COMPLETED'
    };
    
    // Add Bonus (Variable per plan)
    const newTxBonus: Transaction = {
      id: Date.now().toString() + '_bonus',
      type: 'BONUS',
      amount: plan.bonus,
      date: Date.now(),
      status: 'COMPLETED'
    };

    setTransactions(prev => [newTxBonus, newTxBuy, ...prev]);
    setMyInvestments(prev => [...prev, plan]);
    
    setUser(prev => prev ? { 
      ...prev, 
      balance: prev.balance - plan.price + plan.bonus,
      investedAmount: prev.investedAmount + plan.price,
      // If first investment, start timer
      lastClaimTime: prev.investedAmount === 0 ? Date.now() : prev.lastClaimTime
    } : null);

    addNotification('success', `Investissement "${plan.name}" réussi ! Bonus de ${plan.bonus}F ajouté.`);
    return true;
  };

  const claimEarnings = () => {
    if (!user || myInvestments.length === 0) return;
    
    const now = Date.now();
    const elapsed = now - user.lastClaimTime;
    
    if (elapsed >= EARNING_INTERVAL_MS) {
        // Calculate total earning based on owned plans
        const amount = myInvestments.reduce((sum, plan) => sum + plan.incomePerInterval, 0);
        
        const newTx: Transaction = {
            id: Date.now().toString(),
            type: 'EARNING',
            amount: amount,
            date: now,
            status: 'COMPLETED'
        };

        setTransactions(prev => [newTx, ...prev]);
        setUser(prev => prev ? {
            ...prev,
            balance: prev.balance + amount,
            lastClaimTime: now
        } : null);
        
        addNotification('success', `Vous avez récupéré ${amount.toLocaleString()} FCFA !`);
    }
  };

  const simulateReferral = () => {
    if(!user) return;
    const bonus = 500;
    const newTx: Transaction = {
        id: Date.now().toString() + '_ref',
        type: 'REFERRAL',
        amount: bonus,
        date: Date.now(),
        status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => prev ? {
        ...prev,
        balance: prev.balance + bonus,
        referralCount: (prev.referralCount || 0) + 1,
        referralEarnings: (prev.referralEarnings || 0) + bonus
    } : null);
    addNotification('success', `Nouveau filleul ! Bonus de ${bonus}F reçu.`);
  };

  const canClaim = timeUntilNextClaim === 0 && myInvestments.length > 0;

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      transactions,
      myInvestments,
      notifications,
      login,
      register,
      logout,
      deposit,
      withdraw,
      invest,
      canClaim,
      claimEarnings,
      timeUntilNextClaim,
      simulateReferral,
      addNotification,
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
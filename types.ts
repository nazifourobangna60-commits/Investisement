export interface User {
  username: string; // Utilisé comme identifiant/pseudo
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  phone: string;
  balance: number;
  investedAmount: number;
  lastClaimTime: number; // Timestamp
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  dailyReturn?: number; // kept for compatibility or legacy display
  incomePerInterval: number; // New: exact amount earned per interval
  bonus: number; // New: Bonus given immediately upon purchase
}

export enum PaymentMethod {
  MIX = 'Mix By Yas',
  FLOOZ = 'Flooz',
  LINK = 'Lien de Paiement'
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'EARNING' | 'BONUS' | 'REFERRAL';
  amount: number;
  date: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'WAITING_ADMIN';
  method?: PaymentMethod;
  details?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}
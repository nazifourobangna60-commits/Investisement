import { InvestmentPlan } from "./types";

export const APP_NAME = "Jobs France";
export const ADMIN_EMAIL = "ourorara57@gmail.com";

// Payment Configuration
export const MERCHANT_NUMBERS = {
  MIX: "92023753",
  FLOOZ: "97643223"
};

// Game Logic
export const EARNING_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours
export const MIN_WITHDRAWAL = 10000; // FCFA

// Available Investments
export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'appt_student',
    name: 'Studio Étudiant',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&q=80',
    incomePerInterval: 100, // Requested: 100F / 5h
    bonus: 50
  },
  {
    id: 'appt_t2',
    name: 'Appartement T2',
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80',
    incomePerInterval: 400, // Scaled roughly
    bonus: 250
  },
  {
    id: 'villa_luxury',
    name: 'Villa Moderne',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    incomePerInterval: 1600, // Scaled
    bonus: 1000
  },
  {
    id: 'building_corp',
    name: 'Immeuble Bureau',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    incomePerInterval: 4200, // Scaled
    bonus: 3000
  }
];

export const SYSTEM_PROMPT = `
Tu es l'assistant virtuel de l'application "Jobs France".
Ton rôle est d'aider les utilisateurs à comprendre comment investir et gagner de l'argent.
Voici les règles STRICTES à suivre :
1. L'investissement minimum est de 1200 FCFA (Studio) qui rapporte 100 FCFA toutes les 5h.
2. Chaque investissement offre un bonus immédiat spécifique (ex: 50F pour le studio).
3. Le retrait minimum est de 10 000 FCFA.
4. Les retraits nécessitent une validation de l'administrateur (email envoyé à ${ADMIN_EMAIL}).
5. Les paiements se font via Mix By Yas (${MERCHANT_NUMBERS.MIX}) ou Flooz (${MERCHANT_NUMBERS.FLOOZ}).
6. Sois poli, professionnel et encourage l'investissement.
7. Réponds toujours en Français.
`;
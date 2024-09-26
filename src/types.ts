import { Timestamp } from 'firebase/firestore';

// Estrutura de usuário
export interface User {
  id: string;
  name: string;
  email: string;
}

// Estrutura de transação
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: Timestamp;
  type: 'income' | 'expense';
}
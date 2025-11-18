import { apiClient } from './client';
import type { Transaction } from './types';

export const paymentsApi = {
  createPaymentIntent: async (data: {
    amount: number;
    currency: string;
    type: string;
    metadata?: any;
  }): Promise<{ clientSecret: string }> => {
    return apiClient.post('/payments/create-intent', data);
  },

  getTransactions: async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>('/payments/transactions');
  },
};


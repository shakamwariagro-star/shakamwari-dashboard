'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ExpertUser } from '@/lib/types';
import { authenticateExpert, getExpertById } from '@/lib/expertData';

interface ExpertAuthContextType {
  expert: ExpertUser | null;
  loading: boolean;
  login: (username: string, password: string) => string | null; // returns error or null
  logout: () => void;
}

const STORAGE_KEY = 'shakamwari_expert_id';

export const ExpertAuthContext = createContext<ExpertAuthContextType>({
  expert: null,
  loading: true,
  login: () => 'Not initialized',
  logout: () => {},
});

export function useExpertAuth() {
  return useContext(ExpertAuthContext);
}

export function useExpertAuthProvider(): ExpertAuthContextType {
  const [expert, setExpert] = useState<ExpertUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY);
    if (storedId) {
      const found = getExpertById(storedId);
      if (found) setExpert(found);
    }
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): string | null => {
    const user = authenticateExpert(username, password);
    if (!user) return 'Invalid username or password';
    setExpert(user);
    localStorage.setItem(STORAGE_KEY, user.id);
    return null;
  }, []);

  const logout = useCallback(() => {
    setExpert(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { expert, loading, login, logout };
}

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { IS_PREVIEW } from '@/lib/mockData';
import type { Profile } from '@/lib/types';

// MOCK PROFILE FOR PREVIEW - used when Supabase is not configured
const MOCK_PROFILE: Profile = {
  id: 'mock-user-id',
  full_name: 'Kanupriya (Preview)',
  role: 'admin',
  assigned_lab_id: null,
  phone: null,
  created_at: new Date().toISOString(),
};

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_PREVIEW) {
      // Preview mode: use mock profile, skip Supabase
      setProfile(MOCK_PROFILE);
      setLoading(false);
      return;
    }

    // Real auth logic — runs only when Supabase is properly configured
    async function getProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  return { profile, loading };
}

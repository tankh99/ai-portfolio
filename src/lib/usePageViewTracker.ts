
import { useEffect } from 'react';
import { supabase } from './supabaseClient';
import { getSessionId } from './session';
import { usePathname } from 'next/navigation';
import {logPageView} from './pageViews';

export function usePageViewTracker(targetUserId: string) {
  const pathname = usePathname()
  useEffect(() => {
    logPageView(pathname, targetUserId, getSessionId());
  }, [targetUserId, pathname]);
} 
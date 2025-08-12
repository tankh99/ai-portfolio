'use server'

import { supabase } from './supabaseClient';
import { getSessionId } from './session';

export async function logCTAClick(ctaType: 'github' | 'linkedin' | 'resume') {
  await supabase.from('cta_clicks').insert({
    cta_type: ctaType,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    // Add more fields as needed, e.g. user_id
  });
} 
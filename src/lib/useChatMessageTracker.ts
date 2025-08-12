import { supabase } from './supabaseClient';
import { ChatMessageAnalytic } from '@/types';


export async function logChatMessage({
  prompt,
  response,
  is_confident,
  timestamp,
  session_id,
}: ChatMessageAnalytic) {
  await supabase.from('chat_messages').insert({
    prompt,
    response,
    is_confident,
    timestamp,
    session_id,
  });
} 
'use server'

import { getSessionId } from "./session";
import { supabase } from "./supabaseClient";

export async function logPageView(pathname: string, targetUserId: string, sessionId: string) {
    /**
     * targetUserId: The user whose resume site has been visited
     */
    await supabase.from('page_views').insert({
        timestamp: new Date().toISOString(),
        session_id: sessionId,
        user_id: targetUserId,
        page_url: pathname
        // Add more fields as needed, e.g. user_id
    });
}
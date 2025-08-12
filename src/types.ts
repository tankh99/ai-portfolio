
export type ChatMessage = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}


export type ChatMessageAnalytic = {
    id?: number;
    timestamp: string;
    user_id: string;
    session_id: string;
    prompt: string;
    response: string;
    is_confident: boolean
}
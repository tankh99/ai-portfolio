'use client'

import ChatBox from '@/components/chat-box'
import Navbar from '@/components/navbar'
import { getSessionId } from '@/lib/session';
import { logChatMessage } from '@/lib/useChatMessageTracker';
import { usePageViewTracker } from '@/lib/usePageViewTracker';
import { ChatMessage } from '@/types';
import { error } from 'console'
import React, { useState } from 'react'

export default function ResumePage() {

  const [inputValue, setInputValue] = useState(""); // For the controlled input
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "bot",
      text: "Hello! I'm Khang Hou's AI assistant. Ask me anything about his resume, projects or even hobbies!",
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const userId = "777439a1-8c40-44d6-89c3-8c08d28eb470"
  
  usePageViewTracker(userId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userQuestion = inputValue.trim();

    if (!userQuestion) {
      setError("Please enter a question.");
      return;
    }

    // Add user's question to messages
    setMessages(prevMessages => [...prevMessages, { id: Date.now().toString(), text: userQuestion, sender: 'user' }]);
    setInputValue(""); // Clear input field
    setIsLoading(true);
    setError("");

    try {
      
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      // Check if response is streaming
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
        // Handle streaming response
        setIsStreaming(true);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body reader available");
        }

        // Add initial bot message
        const botMessageId = (Date.now() + 1).toString();
        setMessages(prevMessages => [...prevMessages, { id: botMessageId, text: "", sender: 'bot' }]);

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            // const lines = chunk.split('\n');
            // Splitting by \t\t becuase markdown uses \n\n and \n 
            const lines = chunk.split('\t\t')
            
            for (const line of lines) {
              try {

                const data = line.slice(6)
                buffer += data;
                
                setMessages(prevMessages =>
                  prevMessages.map(msg =>
                    msg.id === botMessageId
                      ? { ...msg, text: buffer }
                      : msg
                  )
                );
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', parseError);
              }
            }

          }

        } finally {
          reader.releaseLock();
        }
        // Log bot message after streaming
        logChatMessage({
          prompt: userQuestion,
          user_id: userId,
          session_id: getSessionId(),
          response: buffer,
          is_confident: true, // You may want to add logic to determine confidence level of how confident the AI has answered the query
          timestamp: new Date().toISOString(),
        });
      } else {
        console.log("EY YO?")
        // Handle regular JSON response
        const data = await response.json();
        setMessages(prevMessages => [...prevMessages, { id: (Date.now() + 1).toString(), text: data.answer, sender: 'bot' }]);
        // Log bot message
        logChatMessage({
          prompt: userQuestion,
          user_id: userId,
          session_id: getSessionId(),
          response: data.answer,
          is_confident: true, // You may want to add logic to determine confidence
          timestamp: new Date().toISOString(),
        });
      }

    } catch (err: any) {
      console.error("RAG Error:", err);
      setError(err.message || "Failed to get an answer.");
      // Optionally add error as a bot message
      setMessages(prevMessages => [...prevMessages, { id: (Date.now() + 1).toString(), text: `Error: ${err.message || "Failed to get an answer."}`, sender: 'bot' }]);
      // Log bot error message
      logChatMessage({
        prompt: userQuestion,
        user_id: userId,
        session_id: getSessionId(),
        response: err.message,
        is_confident: false, // You may want to add logic to determine confidence
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };
  return (
    <div className="flex flex-col h-screen font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-neutral-900 via-neutral-800 to-black text-neutral-100">
      <Navbar
        name="Khang Hou"
        githubUrl="https://github.com/tankh99"
        linkedinUrl="https://linkedin.com/in/khanghou"
        resumeUrl="/resume.pdf" // Assuming resume is in public folder
      />
      <ChatBox
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        error={error}
        setError={setError}
      />
    </div>
  )
}

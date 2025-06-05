'use client'

import React, { useState, useEffect, useRef } from "react"; // Added React and useRef
import Navbar from "../components/Navbar"; // Import the Navbar component

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function Home() {
  const [inputValue, setInputValue] = useState(""); // For the controlled input
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      "sender": "bot",
      "text": "Hello! I'm Khang Hou's AI assistant. Ask me anything about his resume, projects or even hobbies!",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // For auto-scrolling

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]); // Scroll when messages change

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

      const data = await response.json();
      // Add bot's answer to messages
      setMessages(prevMessages => [...prevMessages, { id: (Date.now() + 1).toString(), text: data.answer, sender: 'bot' }]);

    } catch (err: any) {
      console.error("RAG Error:", err);
      setError(err.message || "Failed to get an answer.");
      // Optionally add error as a bot message
      setMessages(prevMessages => [...prevMessages, { id: (Date.now() + 1).toString(), text: `Error: ${err.message || "Failed to get an answer."}`, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
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
      {/* Chat messages area is now inside a div that allows Navbar to be sticky */}
      <div className="flex flex-col flex-grow overflow-hidden p-4">
        {/* Chat messages area */}
        <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2 rounded-lg bg-neutral-800/30 border border-neutral-700">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white'
                    : 'bg-neutral-700 text-neutral-100'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow bg-neutral-700 text-neutral-100">
                <p className="animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
        </div>

        {/* Error display */}
        {error && !isLoading && ( // Only show error if not loading new response
          <div className="mb-4 p-3 w-full max-w-md self-center bg-red-700/30 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={handleSubmit} className="w-full mt-4 flex gap-x-2 max-w-xl self-center sticky bottom-4">
          <input
            name="question" // Still useful for FormData if you ever revert, though we use controlled input now
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(""); // Clear error when user starts typing
            }}
            className="flex-grow bg-neutral-700 p-4 rounded-full text-neutral-100 placeholder-neutral-400 border border-neutral-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow duration-150"
            placeholder="Ask anything about my resume"
            disabled={isLoading}
          />
          <button
            className="cursor-pointer
                       bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600
                       text-white font-semibold
                       py-3 px-6 rounded-full shadow-md
                       hover:from-sky-500 hover:via-sky-400 hover:to-sky-500
                       active:from-sky-700 active:via-sky-600 active:to-sky-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white
                       transition-all duration-150 ease-in-out
                       disabled:opacity-70 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
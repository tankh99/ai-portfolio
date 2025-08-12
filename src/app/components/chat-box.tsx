import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types";


type P = {
    messages: ChatMessage[]
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    inputValue: string
    setInputValue: (x: string) => void
    isLoading: boolean
    isStreaming: boolean
    error: string
    setError: (x:string) => void
}

export default function ChatBox(props: P) {

    const {messages, inputValue, setInputValue, handleSubmit, isLoading, isStreaming, error, setError} = props


    const messagesEndRef = useRef<null | HTMLDivElement>(null); // For auto-scrolling

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]); // Scroll when messages change

    return (

        <div className="flex flex-col flex-grow overflow-hidden p-4">
            {/* Chat messages area */}
            <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2 rounded-lg bg-neutral-800/30 border border-neutral-700">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow ${msg.sender === 'user'
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-neutral-700 text-neutral-100'
                                }`}
                        >
                            {msg.sender === 'user' ? (
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({ href, children }) => (
                                                <a href={href} className="text-sky-400 hover:text-sky-300 underline">
                                                    {children}
                                                </a>
                                            ),
                                            code: ({ node, className, children, ...props }) => (
                                                <code className="block bg-neutral-800 rounded p-2 my-2 overflow-x-auto" {...props}>
                                                    {children}
                                                </code>
                                            ),
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-neutral-500 pl-4 my-2 italic">
                                                    {children}
                                                </blockquote>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="list-disc list-inside my-2 space-y-1">
                                                    {children}
                                                </ul>
                                            ),
                                            ol: ({ children }) => (
                                                <ol className="list-decimal pl-2">
                                                    {children}
                                                </ol>
                                            ),
                                            li: ({ children }) => (
                                                <li className="ml-4">
                                                    {children}
                                                </li>
                                            ),
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {(isLoading || isStreaming) && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow bg-neutral-700 text-neutral-100">
                            <p className="animate-pulse">
                                {isStreaming ? "Streaming..." : "Thinking..."}
                            </p>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>

            {/* Error display */}
            {error && !isLoading && !isStreaming && ( // Only show error if not loading new response
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
                    disabled={isLoading || isStreaming}
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
                    disabled={isLoading || isStreaming}
                >
                    {(isLoading || isStreaming) ? "..." : "Send"}
                </button>
            </form>
        </div>
    )
}

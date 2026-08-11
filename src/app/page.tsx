"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Smart auto-scroll: only pin to bottom if user is already near the bottom
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 140;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  const getMessageText = (message: any) => {
    if (message.content) return message.content;
    if (message.parts) {
      return message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => part.text)
        .join("");
    }
    return "";
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200 font-sans">
      {/* ===== Header ===== */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0f1117]/80 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(196,181,253,0.35)]">
          V-Lounge
        </h1>
      </header>

      {/* ===== Main Chat Canvas ===== */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative"
      >
        {/* Empty state – perfectly centered */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-lg sm:text-xl text-slate-400/80 font-light tracking-wide">
              What&apos;s on your mind today?
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-violet-500/90 to-fuchsia-500/80 text-white backdrop-blur-sm"
                    : "bg-white/5 border border-white/10 text-slate-200 backdrop-blur-md"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-headings:my-2">
                    <ReactMarkdown>{getMessageText(message)}</ReactMarkdown>
                  </div>
                ) : (
                  getMessageText(message)
                )}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {(status === "submitted" ||
            (status === "streaming" &&
              messages.length > 0 &&
              messages[messages.length - 1].role !== "assistant")) && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl px-4 py-3 text-sm text-slate-400 animate-pulse">
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ===== Input Bar ===== */}
      <div className="border-t border-white/5 bg-[#0f1117]/70 backdrop-blur-xl px-4 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-center gap-3"
        >
          {/* Pill-shaped input */}
          <input
            className="flex-1 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400/30 transition-all backdrop-blur-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />

          {/* Soft interactive button */}
          {isLoading ? (
            <button
              type="button"
              onClick={() => stop()}
              className="rounded-full px-5 py-3 text-sm font-medium text-rose-100 bg-rose-500/20 border border-rose-400/30 hover:bg-rose-500/30 hover:shadow-[0_0_16px_rgba(251,113,133,0.25)] transition-all"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-full px-5 py-3 text-sm font-medium text-violet-50 bg-gradient-to-r from-violet-500/80 to-fuchsia-500/70 border border-violet-400/20 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-[0_0_20px_rgba(167,139,250,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
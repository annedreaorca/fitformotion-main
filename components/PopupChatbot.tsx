"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PopupChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        chatContainerRef.current && 
        event.target instanceof Node && 
        !chatContainerRef.current.contains(event.target) && 
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.content };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Adjust positions based on screen size
  const buttonPositionClass = "fixed bottom-20 right-6 md:bottom-6 z-40";
  const chatPositionClass = "bottom-36 md:bottom-20";

  return (
    <div className={buttonPositionClass}>
      {/* Chat button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 rounded-full bg-red-800 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div 
          ref={chatContainerRef}
          className={`absolute ${chatPositionClass} right-0 w-80 sm:w-96 h-96 bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-700`}
        >
          {/* Header */}
          <div className="bg-red-900 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-medium">Fitness AI Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-red-800 text-white rounded-tr-none" 
                      : "bg-gray-800 text-white rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-700 p-3 bg-gray-900 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className={`px-4 rounded-r-md ${
                isLoading 
                  ? "bg-gray-700 cursor-not-allowed" 
                  : "bg-red-800 hover:bg-red-700"
              } text-white transition-colors`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
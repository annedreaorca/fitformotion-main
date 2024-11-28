"use client";

import React, { useState } from "react";

export default function AIChatTest() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
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
      const assistantMessage = { role: "assistant", content: data.content };

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

  return (
    <div className="flex justify-center">
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 className="pb-[30px] text-[30px]">Fitness AI Chatbot</h1>
        <div
          style={{
            border: "1px solid #575757",
            borderRadius: "10px",
            padding: "10px",
            maxHeight: "100%",
            overflowY: "auto",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "20px 0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  background: msg.role === "user" ? "#222" : "#000000",
                  color: "#fff",
                }}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: isLoading ? "#ccc" : "#991b1b",
              color: "#fff",
              border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>  
    </div>
  );
}

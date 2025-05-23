"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Maximize2, Minimize2 } from "lucide-react";
import { Avatar } from "@nextui-org/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PopupChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [fullContent, setFullContent] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    // Try to get the thread ID from localStorage
    const savedThreadId = localStorage.getItem("fitnessAssistantThreadId");
    if (savedThreadId) {
      setThreadId(savedThreadId);
      
      // Fetch the conversation history for this thread
      fetchChatHistory(savedThreadId);
    } else {
      // If no thread exists, initialize with a welcome message
      setMessages([
        { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
      ]);
    }
  }, []);

  // Fetch chat history from the backend
  const fetchChatHistory = async (threadId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/chat-history?threadId=${threadId}`, {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }
  
      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        // Apply formatting to each assistant message
        const formattedMessages = data.messages.map((msg: Message) => {
          if (msg.role === "assistant") {
            return {
              ...msg,
              content: formatResponseText(msg.content)
            };
          }
          return msg;
        });
        
        setMessages(formattedMessages);
      } else {
        // If no messages, set the default welcome message
        setMessages([
          { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Set default message if there's an error
      setMessages([
        { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, displayedText]);

  // Close chat when clicking outside (only when not in fullscreen)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !isFullscreen &&
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
  }, [isOpen, isFullscreen]);

  // Character-by-character typing effect
  useEffect(() => {
    if (isTyping && charIndex < fullContent.length) {
      const typingTimer = setTimeout(() => {
        setDisplayedText(prevText => fullContent.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 10); // Speed of typing (lower number = faster)
      
      return () => clearTimeout(typingTimer);
    } else if (isTyping && charIndex >= fullContent.length) {
      // Typing finished
      setIsTyping(false);
      
      // Add the message to the chat after typing is done
      const assistantMessage: Message = { role: "assistant", content: fullContent };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Reset typing state
      setDisplayedText("");
      setFullContent("");
      setCharIndex(0);
    }
  }, [isTyping, charIndex, fullContent]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          threadId: threadId // Include the threadId if we have one
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      
      // Save the threadId from the response if we don't already have one
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
        localStorage.setItem("fitnessAssistantThreadId", data.threadId);
      }
      
      // Format the response with proper paragraph spacing
      const formattedContent = formatResponseText(data.content);
      
      // Start typing effect
      setFullContent(formattedContent);
      setCharIndex(0);
      setDisplayedText("");
      setIsTyping(true);
      
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

 // Function to format response text with proper paragraph spacing
const formatResponseText = (text: string) => {
  // Check if text already has paragraph breaks - if so, minimal processing
  if (text.includes('\n\n')) {
    return text
      // Just handle the asterisks in this case
      .replace(/\*\*([^*]+)\*\*:/g, '### $1:')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/^- \*\*([^:*]+):\*\*/gm, '- <strong>$1:</strong>')
      .replace(/^- \*\*([^*]+)\*\*/gm, '- <strong>$1</strong>')
      .replace(/^\* /gm, '- ');
  }
  
  // For condensed/single block messages (like from history)
  // First identify and preserve list structures
  let formattedText = text
    // Add spacing after periods followed by ** (indicating new sections)
    .replace(/\.(\s*)\*\*/g, '.\n\n**')
    
    // Handle different formats of lists
    .replace(/\*\*([^*]+)\*\*:(\s+)-/g, '**$1:**\n\n-')
    .replace(/\*\*([^*]+)\*\*:/g, '### $1:\n')
    
    // Add newlines before bullet points that follow text
    .replace(/([^-\n])\s*-\s+/g, '$1\n\n- ')
    
    // Add newlines between bullet points when they don't have them
    .replace(/\.(\s+)-/g, '.\n\n-')
    
    // Convert all asterisk bullets to dashes for consistency
    .replace(/^\*/gm, '-')
    
    // Format bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    
    // Add paragraph breaks between sentences that look like they should be separate
    .replace(/\.(\s+)(?=[A-Z])/g, '.\n\n')
    
    // Then apply the standard formatting
    .replace(/([.!?])\s*(?=###)/g, '$1\n\n')
    .replace(/###\s+([^\n]+)/g, '\n\n### $1\n')
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
    
  return formattedText;
};


  // Reset conversation
  const resetConversation = async () => {
    if (window.confirm("Are you sure you want to start a new conversation? Your chat history will be cleared.")) {
      // Clear the threadId from localStorage
      localStorage.removeItem("fitnessAssistantThreadId");
      setThreadId(null);
      
      // Reset the messages with just the welcome message
      setMessages([
        { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
      ]);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // ChatBot icon SVG
  const ChatbotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" />
      <path d="M9.5 9h.01" />
      <path d="M14.5 9h.01" />
      <path d="M9.5 13a3.5 3.5 0 0 0 5 0" />
    </svg>
  );

  // Message content component
  const MessageContent = ({ content }: { content: string }) => {
    // Check if content is a single block or already formatted
    const paragraphs = content.includes('\n\n') 
      ? content.split(/\n\n+/) 
      : [content];
    
    return (
      <>
        {paragraphs.map((paragraph, idx) => {
          // Handle headers
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx} className="font-bold mt-2 mb-1">{paragraph.replace('### ', '')}</h3>;
          }
          // Handle list items - if paragraph contains multiple list items
          else if (paragraph.startsWith('- ') || paragraph.includes('\n- ')) {
            const items = paragraph.split('\n- ');
            return (
              <ul key={idx} className="list-disc pl-5 my-1">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx} 
                      dangerouslySetInnerHTML={{
                        __html: itemIdx === 0 ? item.replace(/^- /, '') : item
                      }}
                  />
                ))}
              </ul>
            );
          }
          // Regular paragraphs (may contain HTML tags)
          else {
            return <p key={idx} className="mb-2" dangerouslySetInnerHTML={{__html: paragraph}} />;
          }
        })}
      </>
    );
  };

  // Button position classes
  const buttonPositionClass = "fixed bottom-20 right-6 md:bottom-6 z-40";
  const chatPositionClass = isFullscreen 
    ? "fixed inset-0 z-50" 
    : "absolute bottom-36 md:bottom-20 right-0 w-80 sm:w-96 h-96";

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
          className={`${chatPositionClass} bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-700 transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-red-900 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="text-white w-6 h-6">
                <ChatbotIcon />
              </div>
              <h3 className="font-medium">Fitness AI Assistant</h3>
            </div>
            <div className="flex items-center space-x-2">
              {/* New button to reset conversation */}
              <button 
                onClick={resetConversation}
                className="text-white hover:text-gray-200 text-xs bg-red-950 px-2 py-1 rounded"
                title="Start a new conversation"
              >
                New Chat
              </button>
              <button 
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-200"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-2 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white">
                      <ChatbotIcon />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-red-800 text-white rounded-tr-none" 
                      : "bg-gray-800 text-white rounded-tl-none"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MessageContent content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
                
                {msg.role === "user" && (
                  <div className="ml-2 flex-shrink-0">
                    <Avatar
                      color="danger"
                      isBordered
                      showFallback
                      name="User"
                      className="w-8 h-8 text-small"
                    />
                  </div>
                )}
              </div>
            ))}
            
            {/* Show typing animation with character-by-character text */}
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white">
                    <ChatbotIcon />
                  </div>
                </div>
                <div className="max-w-[80%] px-4 py-2 rounded-lg bg-gray-800 text-white rounded-tl-none">
                  <MessageContent content={displayedText} />
                  <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-gray-700 p-3 bg-gray-900 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-700"
              disabled={isLoading || isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isTyping || !input.trim()}
              className={`px-4 rounded-r-md ${
                isLoading || isTyping || !input.trim()
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
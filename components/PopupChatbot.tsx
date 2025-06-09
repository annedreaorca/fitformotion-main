//PopupChatbot.tsx
"use client";

import { Avatar } from "@nextui-org/avatar";
import { Maximize2, MessageCircle, Minimize2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ProfileStatus {
  isComplete: boolean;
  hasSeenWizard: boolean;
  hasReceivedRoutineRecommendation?: boolean;
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
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Check profile completion status
  const checkProfileCompletion = async () => {
    try {
      const response = await fetch("/api/profile/check-completion");
      if (response.ok) {
        const data = await response.json();
        setProfileStatus(data);
        return data;
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    }
    return null;
  };

  // Load chat history for existing thread
  const loadChatHistory = async (threadId: string) => {
    console.log(`Attempting to load chat history for thread: ${threadId}`);
    
    try {
      const response = await fetch(`/api/chat-history?threadId=${threadId}`);
      console.log(`Chat history response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`Failed to load chat history: ${response.status} ${response.statusText}`);
        return false;
      }
      
      const data = await response.json();
      console.log("Chat history data:", data);
      
      if (data.error) {
        console.error("Error in chat history response:", data.error);
        return false;
      }
      
      if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        console.log(`Successfully loaded ${data.messages.length} messages`);
        setMessages(data.messages);
        return true;
      } else {
        console.log("No messages found in chat history");
        return false;
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      return false;
    }
  };

  // Helper function to check if user should receive auto routine
  const shouldReceiveAutoRoutine = (status: ProfileStatus | null) => {
    return status?.isComplete && 
           status?.hasSeenWizard && 
           !status?.hasReceivedRoutineRecommendation;
  };

  // Initialize chat when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (isInitialized) return;
      
      const status = await checkProfileCompletion();
      
      // Check if there's an existing threadId in localStorage
      const existingThreadId = localStorage.getItem('chatThreadId');
      
      if (existingThreadId) {
        setThreadId(existingThreadId);
        
        // Try to load existing chat history
        const historyLoaded = await loadChatHistory(existingThreadId);
        
        if (historyLoaded) {
          // History was loaded, don't auto-open
          setIsInitialized(true);
          return;
        } else {
          // Thread exists but no history loaded
          // Check if this thread should have history (i.e., user has received recommendation)
          if (status?.hasReceivedRoutineRecommendation) {
            // User has received recommendation but history failed to load
            // Don't auto-suggest again, just initialize with welcome message
            console.log("User has received recommendation, initializing with welcome message");
            setMessages([
              { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
            ]);
            setIsInitialized(true);
            return;
          } else {
            // Thread exists but user hasn't received recommendation yet, clear invalid threadId
            console.log("Thread exists but no recommendation received, clearing threadId");
            localStorage.removeItem('chatThreadId');
            setThreadId(null);
          }
        }
      }
      
      // Auto-open and request routine if conditions are met
      // This should only run for truly new users who haven't received a recommendation
      if (shouldReceiveAutoRoutine(status) && !hasAutoOpened) {
        console.log("Auto-opening for routine recommendation");
        setHasAutoOpened(true);
        setIsOpen(true);
        
        // Set initial message asking for routine recommendation
        const welcomeMessage = "Welcome! I see you've completed your profile and introduction. Let me create a personalized workout routine for you based on your information.";
        setMessages([{ role: "assistant", content: welcomeMessage }]);
        
        // Automatically request a routine recommendation
        setTimeout(() => {
          handleAutoRoutineRequest();
        }, 2000); // Wait 2 seconds before auto-requesting
      } else {
        // Regular initialization with welcome message (only if no existing history and not auto-opening)
        if (!existingThreadId && !shouldReceiveAutoRoutine(status)) {
          console.log("Regular initialization with welcome message");
          setMessages([
            { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
          ]);
        }
      }
      
      setIsInitialized(true);
    };

    initializeChat();
  }, [isInitialized, hasAutoOpened]);

  // Store threadId in localStorage when it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem('chatThreadId', threadId);
    }
  }, [threadId]);

  // Re-check profile status when component becomes visible (in case user completes wizard in another tab/component)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && isInitialized && !hasAutoOpened) {
        const status = await checkProfileCompletion();
        
        // Check if user has now completed both profile and wizard and hasn't received recommendation
        if (shouldReceiveAutoRoutine(status)) {
          setHasAutoOpened(true);
          setIsOpen(true);
          
          // Clear existing messages and set welcome message
          const welcomeMessage = "Welcome! I see you've completed your profile and introduction. Let me create a personalized workout routine for you based on your information.";
          setMessages([{ role: "assistant", content: welcomeMessage }]);
          
          // Automatically request a routine recommendation
          setTimeout(() => {
            handleAutoRoutineRequest();
          }, 2000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasAutoOpened, isInitialized]);

  // Auto-request routine when profile is complete AND wizard is seen AND not recommended before
  const handleAutoRoutineRequest = async () => {
    const routineRequest = "Please create a personalized workout routine for me based on my profile information.";
    
    // Add user message to chat first
    const userMessage: Message = { role: "user", content: routineRequest };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: routineRequest,
          threadId: threadId,
          isAutoRoutineRequest: true // Flag to mark in database
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      const formattedContent = formatResponseText(data.content);
      
      // Start typing effect
      startTypingAnimation(formattedContent);
      
      // UPDATE: Update local profile status to reflect that recommendation has been given
      setProfileStatus(prev => prev ? {
        ...prev,
        hasReceivedRoutineRecommendation: true
      } : null);
      
    } catch (error) {
      console.error("Error getting routine recommendation:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't generate your routine recommendation right now. Please try asking me directly!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate function to start typing animation
  const startTypingAnimation = (content: string) => {
    setFullContent(content);
    setCharIndex(0);
    setDisplayedText("");
    setIsTyping(true);
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
    if (!isTyping) return;

    if (charIndex < fullContent.length) {
      const typingTimer = setTimeout(() => {
        setDisplayedText(fullContent.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 10);
      
      return () => clearTimeout(typingTimer);
    } else {
      // Typing is complete
      setIsTyping(false);
      
      const assistantMessage: Message = { role: "assistant", content: fullContent };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Reset typing state
      setDisplayedText("");
      setFullContent("");
      setCharIndex(0);
    }
  }, [isTyping, charIndex, fullContent]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage: Message = { role: "user", content: input };
    const currentInput = input.trim();
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: currentInput,
          threadId: threadId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await response.json();
      
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      
      const formattedContent = formatResponseText(data.content);
      
      // Start typing animation
      startTypingAnimation(formattedContent);
      
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
    if (text.includes('\n\n')) {
      return text
        .replace(/\*\*([^*]+)\*\*:/g, '### $1:')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/^- \*\*([^:*]+):\*\*/gm, '- <strong>$1:</strong>')
        .replace(/^- \*\*([^*]+)\*\*/gm, '- <strong>$1</strong>')
        .replace(/^\* /gm, '- ');
    }
    
    let formattedText = text
      .replace(/\.(\s*)\*\*/g, '.\n\n**')
      .replace(/\*\*([^*]+)\*\*:(\s+)-/g, '**$1:**\n\n-')
      .replace(/\*\*([^*]+)\*\*:/g, '### $1:\n')
      .replace(/([^-\n])\s*-\s+/g, '$1\n\n- ')
      .replace(/\.(\s+)-/g, '.\n\n-')
      .replace(/^\*/gm, '-')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\.(\s+)(?=[A-Z])/g, '.\n\n')
      .replace(/([.!?])\s*(?=###)/g, '$1\n\n')
      .replace(/###\s+([^\n]+)/g, '\n\n### $1\n')
      .replace(/\n\n\n+/g, '\n\n')
      .trim();
      
    return formattedText;
  };

  // Reset conversation
  const resetConversation = async () => {
    if (window.confirm("Are you sure you want to start a new conversation? Your chat history will be cleared.")) {
      // Stop any ongoing typing animation
      setIsTyping(false);
      setDisplayedText("");
      setFullContent("");
      setCharIndex(0);
      
      setThreadId(null);
      
      // Clear localStorage
      localStorage.removeItem('chatThreadId');
      
      setMessages([
        { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
      ]);
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    const paragraphs = content.includes('\n\n') 
      ? content.split(/\n\n+/) 
      : [content];
    
    return (
      <>
        {paragraphs.map((paragraph, idx) => {
          // Handle headings (### format)
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-bold text-lg mt-3 mb-2 text-black dark:text-white">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          
          // Handle subheadings or day headers (Day 1, Day 2, etc.) - also handle **bold** format
          if (paragraph.match(/^(\*\*)?(\s*)?(Day\s+\d+|Week\s+\d+|Session\s+\d+)/i)) {
            const cleanText = paragraph.replace(/^\*\*|\*\*$/g, '').trim(); // Remove ** markers
            return (
              <h4 key={idx} className="font-semibold text-base mt-4 mb-2 text-gray-800 dark:text-white pb-1">
                {cleanText}
              </h4>
            );
          }
          
          // Handle bullet points - check if paragraph contains bullet points (both - and * formats)
          if (paragraph.includes('\n- ') || paragraph.startsWith('- ') || 
              paragraph.includes('\n* ') || paragraph.startsWith('* ')) {
            // Split by newlines and process each line
            const lines = paragraph.split('\n');
            const bulletItems: string[] = [];
            let currentItem = '';
            
            lines.forEach(line => {
              if (line.startsWith('- ') || line.startsWith('* ')) {
                // If we have a current item, push it
                if (currentItem) {
                  bulletItems.push(currentItem);
                }
                // Start new item (remove both '- ' and '* ')
                currentItem = line.startsWith('- ') ? line.substring(2) : line.substring(2);
              } else if (line.trim() && currentItem) {
                // Continuation of current item
                currentItem += ' ' + line.trim();
              } else if (line.trim() && !currentItem) {
                // Non-bullet line, treat as separate item
                bulletItems.push(line.trim());
              }
            });
            
            // Don't forget the last item
            if (currentItem) {
              bulletItems.push(currentItem);
            }
            
            return (
              <ul key={idx} className="list-disc pl-6 my-3 space-y-1">
                {bulletItems.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm leading-relaxed text-zinc-800 dark:text-[#c4c4c4]">
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            );
          }
          
          // Handle numbered lists
          if (paragraph.match(/^\d+\./m)) {
            const items = paragraph.split(/(?=\d+\.)/);
            return (
              <ol key={idx} className="list-decimal pl-6 my-3 space-y-1">
                {items.filter(item => item.trim()).map((item, itemIdx) => (
                  <li key={itemIdx} className="text-sm leading-relaxed">
                    <span dangerouslySetInnerHTML={{ 
                      __html: item.replace(/^\d+\.\s*/, '') 
                    }} />
                  </li>
                ))}
              </ol>
            );
          }
          
          // Regular paragraphs
          return (
            <p key={idx} className="mb-3 text-sm leading-relaxed text-zinc-800 dark:text-[#c4c4c4]" 
               dangerouslySetInnerHTML={{ __html: paragraph }} />
          );
        })}
      </>
    );
  };

  // Button position classes
  const buttonPositionClass = "fixed bottom-20 right-6 md:bottom-6 z-40";
  const chatPositionClass = isFullscreen 
    ? "fixed inset-0 z-50 rounded-none" 
    : "absolute bottom-36 md:bottom-20 right-0 w-80 sm:w-96 h-96 bg-white dark:bg-gray-900";

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
          className={`${chatPositionClass} bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden border-zinc-200 dark:border-zinc-800 transition-all duration-300`}
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
          <div className="flex-1 p-4 overflow-y-auto bg-[#f1f1f1] dark:bg-gray-950">
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
                      : "bg-white dark:bg-gray-800 text-zinc-950 dark:text-white rounded-tl-none"
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
                <div className="max-w-[80%] px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-zinc-950 dark:text-white rounded-tl-none">
                  <MessageContent content={displayedText} />
                  <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && !isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-red-800 flex items-center justify-center text-white">
                    <ChatbotIcon />
                  </div>
                </div>
                <div className="max-w-[80%] px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-zinc-950 dark:text-white rounded-tl-none">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-[#f1f1f1] dark:bg-gray-900 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading || isTyping}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || isTyping || !input.trim()}
              className="px-4 py-2 bg-red-800 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
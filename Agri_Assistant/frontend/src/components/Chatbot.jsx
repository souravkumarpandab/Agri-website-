import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sessions State
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('agri_chat_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    const saved = localStorage.getItem('agri_current_session');
    return saved || null;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { t } = useLanguage();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Derived state for current messages
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agri_chat_sessions', JSON.stringify(sessions));
    if (currentSessionId) {
      localStorage.setItem('agri_current_session', currentSessionId);
    }
  }, [sessions, currentSessionId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Ensure a valid session exists when opening the chat
    if (!isOpen) {
      const hasValidSession = sessions.some(s => s.id === currentSessionId);
      if (!currentSessionId || sessions.length === 0 || !hasValidSession) {
        createNewSession();
      }
    }
  };

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Chat',
      messages: [{ sender: 'bot', text: t('chat_welcome') || "Hello! I'm your Agri-Assistant powered by Gemini AI. How can I help with your crops today?" }]
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto close sidebar on mobile
  };

  const selectSession = (id) => {
    setCurrentSessionId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let activeSessionId = currentSessionId;
    
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
    }

    const userMsg = input.trim();
    
    // Update local state immediately with user message
    const updateSessionMessages = (newMsg) => {
      setSessions(prev => {
        const sessionExists = prev.some(s => s.id === activeSessionId);
        
        // If the session somehow doesn't exist, create it with the first message
        if (!sessionExists) {
          return [{ id: activeSessionId, title: newMsg.text || 'New Chat', messages: [newMsg] }, ...prev];
        }

        return prev.map(s => {
          if (s.id === activeSessionId) {
            // Auto-generate title from first user message if it's currently 'New Chat'
            let newTitle = s.title;
            if (newTitle === 'New Chat' && newMsg.sender === 'user') {
              newTitle = newMsg.text.substring(0, 25) + (newMsg.text.length > 25 ? '...' : '');
            }
            return { ...s, title: newTitle, messages: [...s.messages, newMsg] };
          }
          return s;
        });
      });
    };

    updateSessionMessages({ sender: 'user', text: userMsg });
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000"}`}/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(-6)
        })
      });

      const data = await response.json();
      updateSessionMessages({ sender: 'bot', text: data.response });
    } catch (error) {
      updateSessionMessages({ sender: 'bot', text: "❌ Connection error. Is the backend running?" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  return (
    <div className="chatbot-container">
      <div className={`chat-toggle ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-magic'}`}></i>
      </div>

      {isOpen && (
        <>
          <div className="chat-overlay" onClick={toggleChat}></div>
          <div className="chat-interface has-sidebar">
            
            {/* Sidebar */}
            <div className={`chat-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
              <button className="new-chat-btn" onClick={createNewSession}>
                <i className="fas fa-plus"></i> New Chat
              </button>
              
              <div className="history-list">
                <span className="history-title">Recent</span>
                {sessions.map(s => (
                  <div 
                    key={s.id} 
                    className={`history-item ${s.id === currentSessionId ? 'active' : ''}`}
                    onClick={() => selectSession(s.id)}
                  >
                    <i className="far fa-comment-alt"></i>
                    <span className="truncate">{s.title}</span>
                    <i className="fas fa-trash delete-icon" onClick={(e) => deleteSession(e, s.id)}></i>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="chat-main">
              <div className="chat-header">
                <div className="header-title">
                  <i className="fas fa-bars sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}></i>
                  <i className="fas fa-magic gemini-icon"></i>
                  <span>{t('chat_header') || 'Agri Gemini AI'}</span>
                </div>
                <button onClick={toggleChat}>&times;</button>
              </div>

              <div className="chat-body" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="empty-chat-state">
                    <div className="empty-icon-wrapper">
                      <i className="fas fa-seedling"></i>
                    </div>
                    <h2>How can I help you grow today?</h2>
                  </div>
                )}
                
                {messages.map((msg, idx) => (
                  <div key={idx} className={`msg-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="avatar bot-avatar">
                        <i className="fas fa-magic"></i>
                      </div>
                    )}
                    <div className="msg-bubble">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="avatar user-avatar">U</div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="msg-row bot">
                    <div className="avatar bot-avatar">
                      <i className="fas fa-magic"></i>
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="chat-input-area">
                <div className="input-pill">
                  <textarea
                    ref={inputRef}
                    rows="1"
                    placeholder={t('chat_placeholder') || "Enter a prompt here..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
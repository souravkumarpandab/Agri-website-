import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BackButton from '../components/BackButton';
import './AIAssistant.css';

const AIAssistant = ({ onBack }) => {
  
  // Shared Chat Sessions State
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
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Derived state for current messages
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession ? currentSession.messages : [];

  // Reset to a new chat every time the chatbot modal is opened
  useEffect(() => {
    setCurrentSessionId(null);
  }, []);

  // Auto-focus input box when a session changes or on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSessionId]);


  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('agri_chat_sessions', JSON.stringify(sessions));
    if (currentSessionId) {
      localStorage.setItem('agri_current_session', currentSessionId);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [sessions, currentSessionId, messages, isLoading]);

  const createNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Chat',
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const selectSession = (id) => {
    setCurrentSessionId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      setCurrentSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    let activeSessionId = currentSessionId;
    
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
    }

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);
    
    const updateSessionMessages = (newMsg) => {
      setSessions(prev => {
        // Check if the session exists
        const sessionExists = prev.find(s => s.id === activeSessionId);
        
        if (!sessionExists) {
          // Create new session with this message
          let newTitle = 'New Chat';
          if (newMsg.sender === 'user') {
            newTitle = newMsg.text.substring(0, 25) + (newMsg.text.length > 25 ? '...' : '');
          }
          return [{ id: activeSessionId, title: newTitle, messages: [newMsg] }, ...prev];
        }
        
        // Update existing session
        return prev.map(s => {
          if (s.id === activeSessionId) {
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

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/chat`, {
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
      updateSessionMessages({ sender: 'bot', text: "❌ Connection error. Please ensure the backend is running." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="ai-assistant-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton />

      <div className="ai-content-expanded">
        
        {/* NEW CHATBOT SECTION */}
        <div className="ai-full-chat-section">

           
           <div className="embedded-chat-window">
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
                   {onBack && (
                     <button onClick={onBack} style={{ background: 'transparent', color: '#10B981', border: 'none', fontSize: '1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px', fontWeight: 'bold' }}>
                       <i className="fas fa-arrow-left"></i> Back
                     </button>
                   )}
                   <i className="fas fa-bars sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}></i>
                   <i className="fas fa-pen" style={{color: '#10B981', marginRight: '10px'}}></i>
                   <span>AgriSahayak Assistant</span>
                 </div>
               </div>

               <div className="chat-messages" ref={scrollRef}>
                 {messages.length === 0 && (
                   <div className="empty-chat-state">
                     <div className="empty-icon-wrapper">
                       <i className="fas fa-seedling"></i>
                     </div>
                     <div className="glow-box">How can I help you grow today?</div>
                   </div>
                 )}

                 {messages.map((msg, idx) => (
                   <div key={idx} className={`chat-row ${msg.sender}`}>
                      <div className="chat-bubble">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                   </div>
                 ))}
                 {isLoading && (
                   <div className="chat-row bot">
                      <div className="typing-indicator">
                          <span></span><span></span><span></span>
                      </div>
                   </div>
                 )}
               </div>
               
               <div className="chat-input-box">
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                       if (e.key === 'Enter') handleSend();
                    }}
                    placeholder="Type your query here..."
                  />
                  <button onClick={handleSend} disabled={isLoading || !input.trim()}>
                     <i className="fas fa-paper-plane"></i>
                  </button>
               </div>
             </div>
           </div>
        </div>



      </div>
    </motion.div>
  );
};

export default AIAssistant;

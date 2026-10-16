import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { ragService } from '../services/ragService';
import CitationCard from './rag/CitationCard';

export function ChatbotWidget({ onCartUpdated, onProductsUpdated, theme = 'dark', onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: '👋 **Hello! I am your AeroStore AI Concierge**, powered live by **Capgemini Generative Engine** with integrated **RAG Document Retrieval**.\n\nAsk me anything! I can answer store questions from our knowledge base (with verifiable citations) or perform live actions:\n• **Store Policies & Specs:** *Return policy*, *Hardware warranty*, *Shipping SLAs*, *Technical specs*.\n• **Catalog & Actions:** *Add to cart*, *View cart*, *Update quantity*, *Clear cart*, or *Checkout*.\n• **Orders & Account:** *My orders*, *Track order ORD-...*, or *Account profile*.\n\nHow can I help you today?',
      citations: [],
      feedback: null
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState([
    'What is your return policy?',
    'What warranty do you offer?',
    'Recommend a good keyboard',
    'View Cart',
    'Checkout',
    'Active Coupons'
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const toggleChat = () => setIsOpen((prev) => !prev);
  const closeChat = () => setIsOpen(false);

  // Message-level feedback submission
  const handleFeedback = async (msgIdx, rating) => {
    setMessages(prev => prev.map((m, i) => i === msgIdx ? { ...m, feedback: rating } : m));
    const target = messages[msgIdx];
    try {
      await ragService.submitFeedback({
        messageId: `chat-msg-${msgIdx}-${Date.now()}`,
        rating,
        responseSnippet: (target?.content || '').slice(0, 200)
      });
    } catch (e) {
      console.error('Feedback error:', e);
    }
  };

  const sendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || loading) return;

    // Add user message
    const userMsg = { role: 'user', content: query, citations: [] };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setLoading(true);

    try {
      // 1. Check if the query is a knowledge/policy/spec inquiry to augment via RAG retrieval
      let ragCitations = [];
      try {
        const matches = await ragService.listDocuments();
        // Retrieve top matching chunks from vector store
        const searchMatches = await fetch('/api/v1/rag/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, top_k: 3, min_score: 0.10 })
        }).then(r => r.ok ? r.json() : null).catch(() => null);

        if (searchMatches && searchMatches.sources && searchMatches.sources.length > 0) {
          ragCitations = searchMatches.sources.map((s, idx) => ({
            chunk_id: `chk-${idx}`,
            filename: s.title || 'Knowledge Base Document',
            section_or_page: s.category || 'Policy',
            score: s.relevance_score || 0.85,
            snippet: s.snippet,
            content: s.snippet
          }));
        }
      } catch (ragErr) {
        // Fall back gracefully if RAG search is quiet
      }

      // 2. Call backend chatbot API (which handles tool calls, cart updates, and LLM reasoning)
      const history = nextMessages
        .filter((m) => m.role === 'user' || m.role === 'bot')
        .map((m) => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content
        }));

      const res = await api.sendChatMessage(query, history.slice(0, -1));

      // Combine sources from res if available
      const finalCitations = (res.sources && res.sources.length > 0) ? res.sources : ragCitations;

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: res.reply || 'No response received.',
          citations: finalCitations,
          feedback: null
        }
      ]);

      if (res.suggested_commands && res.suggested_commands.length > 0) {
        setChips(res.suggested_commands);
      }

      // Trigger reactive UI refreshes on CRUD operations
      if (res.action_type === 'cart_update' && onCartUpdated) {
        onCartUpdated(res.action_payload?.cart);
      }
      if (res.action_type === 'product_crud' && onProductsUpdated) {
        onProductsUpdated(res.action_payload);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: '⚠️ Sorry, I encountered an error communicating with the AI service. Please ensure the backend is running.',
          citations: [],
          feedback: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    } else if (e.key === 'Escape') {
      closeChat();
    }
  };

  return (
    <aside className="chatbot-container" aria-label="AI Assistant Floating Widget">
      {/* Floating launcher button */}
      <button
        id="chatbot-launcher"
        className="chatbot-launcher"
        onClick={toggleChat}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant Chatbot'}
        aria-haspopup="dialog"
      >
        <img src="/assets/bot.svg" alt="" aria-hidden="true" />
        <span className="pulse-dot" title="AI Assistant Online" />
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          id="chat-window"
          className="chat-window"
          role="dialog"
          aria-modal="false"
          aria-label="AI Shopping & Engineering Assistant"
        >
          {/* Unified Header */}
          <div className="chat-header">
            <div className="chat-bot-info">
              <div className="chat-bot-avatar">
                <img src="/assets/bot.svg" alt="" aria-hidden="true" />
              </div>
              <div>
                <div className="chat-bot-title">AeroStore AI Concierge</div>
                <div className="chat-bot-subtitle">⚡ Capgemini GenAI & RAG Engine</div>
              </div>
            </div>
            <div className="chat-header-actions">
              {onToggleTheme && (
                <button
                  type="button"
                  className="chat-theme-btn"
                  onClick={onToggleTheme}
                  title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                  aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
              )}
              <button
                id="btn-chat-close"
                className="btn-close-icon"
                onClick={closeChat}
                aria-label="Minimize chatbot"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div id="chat-messages-feed" className="chat-messages" role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg-row ${msg.role}`}>
                <div className="chat-bubble">
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

                  {/* Inline Citation Sources for RAG-grounded responses */}
                  {msg.role === 'bot' && msg.citations && msg.citations.length > 0 && (
                    <div style={{ marginTop: '0.6rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>📎 Grounded Knowledge Citations ({msg.citations.length})</span>
                      </div>
                      {msg.citations.map((c, cIdx) => (
                        <CitationCard key={c.chunk_id || cIdx} citation={c} index={cIdx} />
                      ))}
                    </div>
                  )}

                  {/* Inline Message Feedback (👍 / 👎) */}
                  {msg.role === 'bot' && idx > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      marginTop: '0.45rem',
                      paddingTop: '0.35rem',
                      borderTop: '1px dashed rgba(148, 163, 184, 0.15)',
                      fontSize: '0.7rem',
                      color: '#64748b'
                    }}>
                      <span>Was this helpful?</span>
                      <button
                        type="button"
                        onClick={() => handleFeedback(idx, 'thumbs_up')}
                        style={{
                          background: msg.feedback === 'thumbs_up' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: msg.feedback === 'thumbs_up' ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          padding: '0.1rem 0.35rem',
                          color: msg.feedback === 'thumbs_up' ? '#34d399' : '#94a3b8'
                        }}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFeedback(idx, 'thumbs_down')}
                        style={{
                          background: msg.feedback === 'thumbs_down' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          border: msg.feedback === 'thumbs_down' ? '1px solid #ef4444' : '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          padding: '0.1rem 0.35rem',
                          color: msg.feedback === 'thumbs_down' ? '#f87171' : '#94a3b8'
                        }}
                      >
                        👎
                      </button>
                      {msg.feedback && (
                        <span style={{ color: '#10b981', fontSize: '0.68rem' }}>Recorded</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg-row bot">
                <div className="chat-bubble" style={{ color: '#94a3b8' }}>
                  <span>Executing operation & retrieving knowledge...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Chips */}
          <div className="chat-chips-bar">
            {chips.map((chip, idx) => (
              <button
                key={idx}
                className="chat-chip"
                onClick={() => sendMessage(chip)}
                disabled={loading}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="chat-input-bar">
            <input
              type="text"
              id="chat-user-input"
              ref={inputRef}
              className="chat-input"
              placeholder="Ask a question or type /help..."
              aria-label="Message AI assistant"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              id="btn-chat-send"
              className="btn-chat-send"
              onClick={() => sendMessage()}
              disabled={loading || !inputText.trim()}
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

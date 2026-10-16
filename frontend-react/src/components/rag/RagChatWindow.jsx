import React, { useState, useEffect, useRef } from 'react';
import { ragService } from '../../services/ragService';
import CitationCard from './CitationCard';

export default function RagChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: 'Hello! I am your AeroStore RAG Knowledge Assistant. Ask me anything regarding store operations, hardware specs, 30-day returns, warranty policies, or any custom documents ingested into the vector index.',
      citations: [],
      feedback: null,
      retrievalMs: null
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeCitations, setActiveCitations] = useState([]);
  const [activeRetrievalMs, setActiveRetrievalMs] = useState(null);
  const [topK, setTopK] = useState(4);
  const [minScore, setMinScore] = useState(0.08);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const query = inputQuery.trim();
    if (!query || isStreaming) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    const assistantMsgId = `asst-${Date.now()}`;
    const initialAssistantMsg = {
      id: assistantMsgId,
      role: 'assistant',
      text: '',
      citations: [],
      feedback: null,
      retrievalMs: null,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage, initialAssistantMsg]);
    setInputQuery('');
    setIsStreaming(true);
    setActiveCitations([]);
    setActiveRetrievalMs(null);

    let accumulatedText = '';
    let fetchedCitations = [];
    let rMs = null;

    try {
      await ragService.streamChat(query, {
        top_k: topK,
        min_score: minScore,
        onCitation: (citations, retrievalMs) => {
          fetchedCitations = citations;
          rMs = retrievalMs;
          setActiveCitations(citations);
          setActiveRetrievalMs(retrievalMs);
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId
                ? { ...m, citations, retrievalMs }
                : m
            )
          );
        },
        onToken: (token) => {
          accumulatedText += token;
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId
                ? { ...m, text: accumulatedText }
                : m
            )
          );
        },
        onDone: (meta) => {
          setIsStreaming(false);
        },
        onError: (err) => {
          setIsStreaming(false);
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: accumulatedText + `\n\n⚠️ Error: ${err.message}`
                  }
                : m
            )
          );
        }
      });
    } catch (err) {
      setIsStreaming(false);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, text: `⚠️ Failed to get response: ${err.message}` }
            : m
        )
      );
    }
  };

  const handleFeedback = async (messageId, rating) => {
    const targetMsg = messages.find(m => m.id === messageId);
    if (!targetMsg) return;

    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback: rating } : m))
    );

    try {
      await ragService.submitFeedback({
        messageId,
        rating,
        responseSnippet: targetMsg.text.slice(0, 200)
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '650px',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderRadius: '16px',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(16px)'
    }}>
      {/* Top Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(30, 41, 59, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            🤖
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              Enterprise RAG Chat Interface
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              ● Grounded Retrieval Active (SSE Streaming)
            </span>
          </div>
        </div>

        {/* Configuration Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Top-K:
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#e2e8f0',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '6px',
                padding: '0.2rem 0.4rem',
                fontSize: '0.75rem'
              }}
            >
              <option value={2}>2 chunks</option>
              <option value={4}>4 chunks</option>
              <option value={6}>6 chunks</option>
            </select>
          </label>
        </div>
      </div>

      {/* Messages Body */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: isUser ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                background: isUser ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(30, 41, 59, 0.85)',
                color: isUser ? '#ffffff' : '#f1f5f9',
                padding: '0.85rem 1.15rem',
                borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                border: isUser ? 'none' : '1px solid rgba(148, 163, 184, 0.15)',
                fontSize: '0.9rem',
                lineHeight: '1.55',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text || (isStreaming && msg.id.startsWith('asst') ? 'Thinking & retrieving knowledge...' : '')}
              </div>

              {/* Citations Container */}
              {!isUser && msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop: '0.65rem', width: '100%', maxWidth: '650px' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '0.35rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <span>📎 Grounded Sources & Citations ({msg.citations.length})</span>
                    {msg.retrievalMs && (
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>
                        • Retrieved in {msg.retrievalMs}ms
                      </span>
                    )}
                  </div>
                  {msg.citations.map((c, i) => (
                    <CitationCard key={c.chunk_id || i} citation={c} index={i} />
                  ))}
                </div>
              )}

              {/* Message-level Feedback (Thumbs Up / Down) */}
              {!isUser && msg.id !== 'msg-welcome' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.4rem',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <span>Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(msg.id, 'thumbs_up')}
                    style={{
                      background: msg.feedback === 'thumbs_up' ? 'rgba(16, 185, 129, 0.2)' : 'none',
                      border: msg.feedback === 'thumbs_up' ? '1px solid #10b981' : '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.8rem',
                      color: msg.feedback === 'thumbs_up' ? '#34d399' : '#94a3b8'
                    }}
                    title="Good response"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleFeedback(msg.id, 'thumbs_down')}
                    style={{
                      background: msg.feedback === 'thumbs_down' ? 'rgba(239, 68, 68, 0.2)' : 'none',
                      border: msg.feedback === 'thumbs_down' ? '1px solid #ef4444' : '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '0.15rem 0.45rem',
                      fontSize: '0.8rem',
                      color: msg.feedback === 'thumbs_down' ? '#f87171' : '#94a3b8'
                    }}
                    title="Poor response"
                  >
                    👎
                  </button>
                  {msg.feedback && (
                    <span style={{ color: '#10b981', fontSize: '0.72rem' }}>Feedback recorded!</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} style={{
        padding: '1rem 1.5rem',
        borderTop: '1px solid rgba(148, 163, 184, 0.15)',
        background: 'rgba(30, 41, 59, 0.7)',
        display: 'flex',
        gap: '0.75rem'
      }}>
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question grounded in knowledge documents (e.g. 'What is the return policy?')..."
          disabled={isStreaming}
          style={{
            flex: 1,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: '10px',
            padding: '0.75rem 1.15rem',
            color: '#f8fafc',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          disabled={isStreaming || !inputQuery.trim()}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: isStreaming || !inputQuery.trim() ? 'not-allowed' : 'pointer',
            opacity: isStreaming || !inputQuery.trim() ? 0.6 : 1,
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}
        >
          {isStreaming ? 'Streaming...' : 'Ask AI ⚡'}
        </button>
      </form>
    </div>
  );
}

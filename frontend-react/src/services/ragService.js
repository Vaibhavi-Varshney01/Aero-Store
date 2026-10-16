/**
 * Production RAG API Client Service
 * Handles Document Ingestion (Multipart), Streaming SSE Chat, Health, Metrics, and Feedback.
 */

const API_BASE = '/api/v1/rag';

export const ragService = {
  /**
   * Uploads multiple files (PDF, DOCX, HTML, SQL) for parsing and vector indexing (Admin).
   * @param {FileList|File[]} files
   * @param {string} token - Bearer JWT Token
   * @returns {Promise<any>}
   */
  async ingestDocuments(files, token) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || 'Failed to ingest documents');
    }

    return await res.json();
  },

  /**
   * Retrieves list of all indexed knowledge documents.
   */
  async listDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) throw new Error('Failed to fetch indexed documents');
    return await res.json();
  },

  /**
   * Deletes a document by ID (Admin only).
   */
  async deleteDocument(docId, token) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE}/documents/${docId}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return await res.json();
  },

  /**
   * Streams RAG response via Server-Sent Events (SSE).
   * @param {string} query
   * @param {object} options - { top_k, min_score, onCitation, onToken, onDone, onError }
   */
  async streamChat(query, { top_k = 4, min_score = 0.08, onCitation, onToken, onDone, onError }) {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, top_k, min_score }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded: Please wait a moment before sending more queries.');
        }
        const err = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(err.detail || 'Chat query failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop(); // Retain remainder in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line.trim());
            if (data.type === 'citations') {
              if (onCitation) onCitation(data.citations, data.retrieval_ms);
            } else if (data.type === 'token') {
              if (onToken) onToken(data.token);
            } else if (data.type === 'done') {
              if (onDone) onDone(data);
            } else if (data.type === 'error') {
              if (onError) onError(new Error(data.message));
            }
          } catch (e) {
            // Non-JSON SSE line or partial buffer
          }
        }
      }
    } catch (err) {
      if (onError) onError(err);
      else throw err;
    }
  },

  /**
   * Submits message feedback (thumbs up / thumbs down).
   */
  async submitFeedback({ messageId, rating, query = '', responseSnippet = '', feedbackText = '' }) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: messageId,
        rating,
        query,
        response_snippet: responseSnippet,
        feedback_text: feedbackText,
      }),
    });
    if (!res.ok) throw new Error('Failed to record feedback');
    return await res.json();
  },

  /**
   * Fetches RAG deep health status.
   */
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch RAG health');
    return await res.json();
  },

  /**
   * Fetches RAG query latency and feedback metrics.
   */
  async getMetrics() {
    const res = await fetch(`${API_BASE}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch RAG metrics');
    return await res.json();
  },
};

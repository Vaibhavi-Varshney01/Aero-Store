import React, { useState, useEffect, useRef } from 'react';
import { ragService } from '../../services/ragService';
import { useAuth } from '../../context/AuthContext';

export default function AdminDocumentIngestion({ onIngestSuccess }) {
  const { token } = useAuth();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ingestResult, setIngestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadDocuments = async () => {
    setLoadingDocs(true);
    try {
      const docs = await ragService.listDocuments();
      setDocuments(docs);
    } catch (e) {
      console.error('Failed to load documents:', e);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
    }
  };

  const handleFilesSelected = (files) => {
    setErrorMsg('');
    const validExtensions = ['.pdf', '.docx', '.html', '.htm', '.sql', '.txt', '.md'];
    const filtered = files.filter(f => {
      const ext = '.' + f.name.split('.').pop().toLowerCase();
      return validExtensions.includes(ext);
    });

    if (filtered.length < files.length) {
      setErrorMsg('Some files were ignored. Supported: PDF, DOCX, HTML, SQL, TXT, MD.');
    }
    setSelectedFiles(prev => [...prev, ...filtered]);
  };

  const removeSelectedFile = (idx) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadAndIngest = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setErrorMsg('');
    setIngestResult(null);
    setUploadProgress(20);

    try {
      const progressTimer = setInterval(() => {
        setUploadProgress(p => (p < 85 ? p + 15 : p));
      }, 200);

      const res = await ragService.ingestDocuments(selectedFiles, token);
      clearInterval(progressTimer);
      setUploadProgress(100);
      setIngestResult(res);
      setSelectedFiles([]);
      loadDocuments();
      if (onIngestSuccess) onIngestSuccess(res);
    } catch (err) {
      setErrorMsg(err.message || 'Ingestion failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm(`Delete document '${docId}' and all its vector chunks?`)) return;
    setDeletingId(docId);
    try {
      await ragService.deleteDocument(docId, token);
      setDocuments(prev => prev.filter(d => d.doc_id !== docId));
    } catch (err) {
      alert(err.message || 'Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-ingestion-container" style={{
      background: 'rgba(15, 23, 42, 0.75)',
      borderRadius: '16px',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      padding: '1.75rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(12px)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Enterprise Knowledge Base & Document Ingestion
            </h3>
            <span style={{
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(99, 102, 241, 0.4)'
            }}>ADMIN ONLY</span>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
            Upload PDFs, DOCX specifications, HTML docs, or SQL table schemas to automatically chunk, embed, and index into the vector store.
          </p>
        </div>
        <button
          onClick={loadDocuments}
          disabled={loadingDocs}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#cbd5e1',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          🔄 {loadingDocs ? 'Refreshing...' : 'Refresh Index'}
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={{
          border: `2px dashed ${isDragging ? '#6366f1' : 'rgba(99, 102, 241, 0.35)'}`,
          backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.12)' : 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          padding: '2.2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.html,.htm,.sql,.txt,.md"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
        <h4 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem', fontWeight: 600 }}>
          Drag & Drop Knowledge Documents Here, or <span style={{ color: '#818cf8', textDecoration: 'underline' }}>Browse</span>
        </h4>
        <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>
          Supported: <strong>PDF</strong> (page-by-page), <strong>DOCX</strong> (sections & tables), <strong>HTML</strong> (structured DOM), <strong>SQL</strong> (schemas & tables)
        </p>
      </div>

      {errorMsg && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Selected Files Queue */}
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '1.25rem', background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
              Pending Upload Queue ({selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'})
            </span>
            <button
              onClick={handleUploadAndIngest}
              disabled={uploading}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
              }}
            >
              {uploading ? `Processing (${uploadProgress}%)...` : '⚡ Start Ingestion Pipeline'}
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selectedFiles.map((file, i) => (
              <div key={i} style={{
                background: 'rgba(30, 41, 59, 0.8)',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#cbd5e1',
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <span>📄 {file.name}</span>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                {!uploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSelectedFile(i); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {uploading && (
            <div style={{ marginTop: '0.75rem', width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.9)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)', transition: 'width 0.3s ease' }} />
            </div>
          )}
        </div>
      )}

      {/* Ingest Result Success Card */}
      {ingestResult && (
        <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600, fontSize: '0.9rem' }}>
            <span>✅ Ingestion Complete:</span>
            <span>{ingestResult.total_new_chunks} new chunks created and indexed into vector store!</span>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ingestResult.files?.map((f, i) => (
              <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(0, 0, 0, 0.2)', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#a7f3d0' }}>
                {f.filename} • {f.chunks_added} chunks
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Currently Indexed Documents Table */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📑</span> Active Vector Index Documents ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No custom documents indexed yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Document / File</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Chunks</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Sections / Pages</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Preview Snippet</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.doc_id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)', color: '#cbd5e1' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#f1f5f9' }}>
                      📄 {doc.filename}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                        {doc.chunk_count}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#94a3b8' }}>
                      {doc.sections?.slice(0, 3).join(', ') || 'N/A'}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#64748b', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.sample_snippet}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(doc.doc_id)}
                        disabled={deletingId === doc.doc_id}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        {deletingId === doc.doc_id ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

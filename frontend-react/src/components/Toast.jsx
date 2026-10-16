import React, { useEffect } from 'react';

export function Toast({ notification, onClose }) {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${notification.type || 'info'}`}>
        {notification.message}
      </div>
    </div>
  );
}

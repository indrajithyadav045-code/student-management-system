import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={20} color="#059669" />;
      case 'error':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'info':
      default:
        return <Info size={20} color="#2563eb" />;
    }
  };

  return (
    <div className={`toast toast-${toast.type || 'info'}`} role="alert">
      <div className="toast-icon-wrapper">
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-msg">{toast.message}</div>
      </div>
      <button 
        className="btn-ghost btn-icon"
        style={{ width: '28px', height: '28px' }}
        onClick={() => onDismiss(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

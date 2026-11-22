import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title = "Delete Student Record",
  student,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !student) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div 
        className="modal-container" 
        style={{ maxWidth: '480px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <AlertTriangle size={20} color="#dc2626" />
            <span>{title}</span>
          </h2>
          <button 
            className="btn-ghost btn-icon" 
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="confirm-body">
          <div className="confirm-icon-box">
            <Trash2 size={24} />
          </div>
          <div className="confirm-text">
            <h3>Are you absolutely sure?</h3>
            <p>
              You are about to delete <strong>{student.fullName}</strong> ({student.registerNumber}).
            </p>
            <p style={{ marginTop: '8px', color: '#dc2626', fontSize: '0.8125rem' }}>
              This record will be permanently purged from LocalStorage and cannot be retrieved.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={() => onConfirm(student.id)}
          >
            <Trash2 size={16} />
            <span>Yes, Delete Record</span>
          </button>
        </div>
      </div>
    </div>
  );
}

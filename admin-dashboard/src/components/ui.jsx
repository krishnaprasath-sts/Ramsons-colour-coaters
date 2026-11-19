import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiLoader,
  FiX,
} from 'react-icons/fi';

/* ------------------------------------------------------------------ */
/* Spinner + loading / empty states                                    */
/* ------------------------------------------------------------------ */
export function Spinner({ size = 16 }) {
  return <FiLoader className="spin" size={size} aria-hidden="true" />;
}

export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <Spinner size={26} />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon = FiInfo, title, children, action }) {
  return (
    <div className="state-block">
      <span className="state-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview of an image file chosen in a form                           */
/* ------------------------------------------------------------------ */
/** Returns a temporary URL for `file` ('' when there is none) and frees it when it changes. */
export function useFilePreview(file) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url]
  );
  return url;
}

/* ------------------------------------------------------------------ */
/* Inline alert                                                        */
/* ------------------------------------------------------------------ */
const ALERT_ICONS = { success: FiCheckCircle, danger: FiAlertCircle, info: FiInfo };

export function Alert({ type = 'info', children, onClose }) {
  const Icon = ALERT_ICONS[type] || FiInfo;
  return (
    <div className={`alert alert-${type}`} role={type === 'danger' ? 'alert' : 'status'}>
      <Icon className="alert-icon" aria-hidden="true" />
      <div className="alert-text">{children}</div>
      {onClose && (
        <button type="button" className="icon-btn icon-btn-sm" onClick={onClose} aria-label="Dismiss message">
          <FiX aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast notifications                                                 */
/* ------------------------------------------------------------------ */
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (text, type = 'success') => {
      const id = nextId.current++;
      setToasts((list) => [...list, { id, text, type }]);
      setTimeout(() => dismiss(id), type === 'danger' ? 7000 : 4500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = ALERT_ICONS[toast.type] || FiInfo;
          return (
            <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
              <Icon className="toast-icon" aria-hidden="true" />
              <span>{toast.text}</span>
              <button
                type="button"
                className="icon-btn icon-btn-sm"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/** const notify = useToast(); notify('Saved'); notify('Failed', 'danger'); */
export function useToast() {
  return useContext(ToastContext);
}

/* ------------------------------------------------------------------ */
/* Modal + confirm dialog                                              */
/* ------------------------------------------------------------------ */
export function Modal({ title, onClose, children, footer, size = 'md', busy = false, labelId = 'modal-title' }) {
  const cardRef = useRef(null);

  // Escape closes the dialog; the page behind must not scroll while it is open.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, busy]);

  // Move keyboard focus into the dialog, and give it back when the dialog closes.
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    if (cardRef.current) cardRef.current.focus();
    return () => {
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, []);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={cardRef}
        className={`modal-card modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id={labelId}>{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} disabled={busy} aria-label="Close dialog">
            <FiX aria-hidden="true" />
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  details,
  confirmLabel = 'Delete',
  busyLabel = 'Deleting...',
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="sm"
      busy={busy}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? (
              <>
                <Spinner /> {busyLabel}
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </>
      }
    >
      <div className="modal-body confirm-body">
        <span className="confirm-icon" aria-hidden="true">
          <FiAlertTriangle />
        </span>
        <p>{message}</p>
        {details && <div className="confirm-details">{details}</div>}
      </div>
    </Modal>
  );
}

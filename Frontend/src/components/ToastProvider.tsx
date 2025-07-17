import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  description?: string;
}

interface ToastContextType {
  success: (message: string, options?: { description?: string }) => void;
  error: (message: string, options?: { description?: string }) => void;
  info: (message: string, options?: { description?: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: number) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  };

  const showToast = (type: Toast['type'], message: string, description?: string) => {
    const id = ++toastId;
    setToasts((toasts) => [...toasts, { id, type, message, description }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const contextValue: ToastContextType = {
    success: (message, options) => showToast('success', message, options?.description),
    error: (message, options) => showToast('error', message, options?.description),
    info: (message, options) => showToast('info', message, options?.description),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
 
const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) => (
  <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`max-w-xs w-full rounded shadow-lg px-4 py-3 text-white flex items-start space-x-2 animate-slide-in-right
          ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}
      >
        <div className="flex-1">
          <div className="font-semibold">{toast.message}</div>
          {toast.description && <div className="text-sm opacity-80">{toast.description}</div>}
        </div>
        <button onClick={() => removeToast(toast.id)} className="ml-2 text-white/80 hover:text-white">&times;</button>
      </div>
    ))}
  </div>
);

// Add a simple slide-in animation
// In your global CSS (e.g., index.css or tailwind.css), add:
// @keyframes slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
// .animate-slide-in-right { animation: slide-in-right 0.3s ease; } 
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import type { ToastType } from '../../hooks/useToast';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    requestAnimationFrame(() => {
      setIsShowing(true);
    });
  }, []);

  const handleClose = () => {
    setIsShowing(false);
    setTimeout(onClose, 300); // Wait for transition before unmounting
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-green-200',
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          shadow: 'shadow-green-500/10'
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          shadow: 'shadow-red-500/10'
        };
      case 'info':
      default:
        return {
          bg: 'bg-white',
          border: 'border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          shadow: 'shadow-blue-500/10'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 min-w-[300px] border px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform 
        ${styles.bg} ${styles.border} ${styles.shadow} 
        ${isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className="shrink-0">{styles.icon}</div>
      <p className="text-sm font-medium text-slate-700 flex-1">{message}</p>
      <button
        onClick={handleClose}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

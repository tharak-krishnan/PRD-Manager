import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export type ModalType = 'confirm' | 'alert' | 'info' | 'success';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'confirm',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the confirm button when modal opens
    confirmButtonRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'alert':
      case 'confirm':
        return <AlertTriangle size={48} className="text-yellow-500" />;
      case 'info':
        return <Info size={48} className="text-blue-500" />;
      case 'success':
        return <CheckCircle size={48} className="text-green-500" />;
    }
  };

  const getDefaultButtonClass = () => {
    switch (type) {
      case 'alert':
      case 'confirm':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-gray-800 border border-gray-700 shadow-xl transition-all w-full max-w-lg"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1">
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-gray-100 mb-2"
                >
                  {title}
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap">{message}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
            {type === 'confirm' && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 transition-colors ${
                confirmButtonClass || getDefaultButtonClass()
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

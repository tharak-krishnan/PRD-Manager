import { useState, useCallback } from 'react';
import { ModalType } from '../components/Modal';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
  });

  const showModal = useCallback(
    (config: Omit<ModalState, 'isOpen'>) => {
      setModalState({
        ...config,
        isOpen: true,
      });
    },
    []
  );

  const hideModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const confirm = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      confirmText = 'Delete',
      cancelText = 'Cancel'
    ) => {
      showModal({
        title,
        message,
        type: 'confirm',
        onConfirm,
        confirmText,
        cancelText,
      });
    },
    [showModal]
  );

  const alert = useCallback(
    (title: string, message: string, confirmText = 'OK') => {
      showModal({
        title,
        message,
        type: 'alert',
        confirmText,
      });
    },
    [showModal]
  );

  const info = useCallback(
    (title: string, message: string, confirmText = 'OK') => {
      showModal({
        title,
        message,
        type: 'info',
        confirmText,
      });
    },
    [showModal]
  );

  const success = useCallback(
    (title: string, message: string, confirmText = 'OK') => {
      showModal({
        title,
        message,
        type: 'success',
        confirmText,
      });
    },
    [showModal]
  );

  return {
    modalState,
    showModal,
    hideModal,
    confirm,
    alert,
    info,
    success,
  };
};

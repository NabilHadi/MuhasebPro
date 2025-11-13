import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: '',
    message: '',
    confirmText: 'تأكيد',
    cancelText: 'إلغاء',
    isDangerous: false,
  });
  const [resolveCallback, setResolveCallback] = useState<((value: boolean) => void) | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title: opts.title,
        message: opts.message,
        confirmText: opts.confirmText || 'تأكيد',
        cancelText: opts.cancelText || 'إلغاء',
        isDangerous: opts.isDangerous || false,
      });
      setResolveCallback(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsLoading(true);
    if (resolveCallback) {
      resolveCallback(true);
    }
    setIsOpen(false);
    setIsLoading(false);
  }, [resolveCallback]);

  const handleCancel = useCallback(() => {
    if (resolveCallback) {
      resolveCallback(false);
    }
    setIsOpen(false);
    setIsLoading(false);
  }, [resolveCallback]);

  return {
    isOpen,
    options,
    isLoading,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export default useConfirmModal;

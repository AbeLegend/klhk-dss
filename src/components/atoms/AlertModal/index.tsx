// lib
import React, { ReactNode } from "react";
// local
import { Button } from "@/components/atoms";
import { cn } from "@/lib";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-[50vw] w-fit p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        {message && <p className="text-gray-600 mb-4">{message}</p>}
        {children}
        <div className="flex justify-end space-x-2">
          {onClose && cancelText && (
            <Button label={cancelText} onClick={onClose} />
          )}

          {onConfirm && confirmText && (
            <Button
              type="submit"
              label={confirmText}
              variant="primary-destructive"
              className={cn([
                "w-fit rounded-lg",
                "hover:bg-accent-surface hover:text-accent",
                "disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed",
              ])}
              onClick={onConfirm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

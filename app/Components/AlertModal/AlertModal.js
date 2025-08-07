// components/AlertModal.js
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import style from './AlertModal.module.css';
import Image from 'next/image';

export const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'تأیید',
  cancelText = 'انصراف',
  onConfirm,
  showCancel = true,
  icon,
  imageUrl,
  type = 'info',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return style.success;
      case 'error':
        return style.error;
      case 'warning':
        return style.warning;
      default:
        return style.info;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'success':
        return style.confirmButtonSuccess;
      case 'error':
        return style.confirmButtonError;
      case 'warning':
        return style.confirmButtonWarning;
      default:
        return style.confirmButtonInfo;
    }
  };

  return createPortal(
    <div className={style.overlay}>
      <div className={`${style.modal} ${getTypeClass()}`}>
        <div className={style.content}>
          <div className={style.header}>
            <div className={style.titleContainer}>
              {icon && <div className={style.iconContainer}>{icon}</div>}
              <h3 className={style.title}>{title}</h3>
            </div>
            <button
              onClick={onClose}
              className={style.closeButton}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {imageUrl && (
            <div className={style.imageContainer}>
              <Image
                src={imageUrl}
                alt="Modal image"
                className={style.image}
                layout="responsive"
                width={500}
                height={300}
              />
            </div>
          )}

          <p className={style.message}>{message}</p>

          <div className={style.actions}>
            {showCancel && (
              <button
                onClick={onClose}
                className={style.cancelButton}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                onClose();
              }}
              className={`${style.confirmButton} ${getConfirmButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
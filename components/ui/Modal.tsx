"use client";
import React, { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm',
        'motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out'
      )}
      onClick={onClose}
    >
      <div
        data-state="open"
        className={cn(
          'relative w-full max-w-lg mx-4',
          'bg-white rounded-lg shadow-sm',
          'border border-neutral-200',
          'p-6',
          
          // Animation
          'motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out',
          'data-[state=open]:scale-100 data-[state=open]:opacity-100',
          'motion-reduce:transform-none',
          
          // Dark mode
          'dark:bg-neutral-800 dark:border-neutral-700',
          
          className
        )}
        onClick={e => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-heading mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
};

export default Modal;

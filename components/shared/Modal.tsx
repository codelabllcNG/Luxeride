'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw]'
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'lg'
}: ModalProps) {
  // We need to track if the component is mounted to safely access document.body
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Prevent hydration mismatch by returning null on server
  if (!mounted) return null;

  // Use createPortal to render the modal at the end of the document body
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`
              relative w-full ${sizeStyles[size]}
              bg-dark-charcoal rounded-2xl
              border border-dark-lighter
              shadow-2xl max-h-[90vh] overflow-y-auto
              scrollbar-hide
            `}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-dark-lighter sticky top-0 bg-dark-charcoal z-10">
                <h2 className="text-2xl font-bold text-grey-pastel">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors"
                  aria-label="Close modal"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Close button if no title */}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-grey-medium hover:text-primary hover:bg-dark-lighter transition-colors z-20"
                aria-label="Close modal"
              >
                <XIcon className="w-6 h-6" />
              </button>
            )}

            {/* Body */}
            <div className={title ? 'p-6' : 'p-6 pt-12'}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
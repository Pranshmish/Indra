import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Modal = ({ show, onClose, children }) => {
  const modalRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    if (show) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(modalRef.current,
        {
          scale: 0.8,
          opacity: 0,
          y: 50
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "back.in(1.7)",
      });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative max-w-lg w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          ×
        </button>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

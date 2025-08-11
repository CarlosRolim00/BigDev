import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (fundo escuro)
    <div 
      className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      {/* Conteúdo do Modal */}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Impede que o modal feche ao clicar dentro dele
      >
        {children}
      </div>
    </div>
  );
}
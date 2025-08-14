import React, { useState } from 'react';
import Modal from '../Modal'; // Usando o nosso componente de Modal genérico

type ReviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    restaurantName: string;
};

export default function ReviewModal({ isOpen, onClose, restaurantName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Apenas simula o envio e fecha o modal
        alert(`Avaliação para "${restaurantName}" enviada com sucesso! (Simulação)`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col">
                <h2 className="text-xl font-bold mb-4">Avaliar sua visita em {restaurantName}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Sua nota</label>
                        <div className="flex text-3xl">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`mr-1 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Seu comentário (opcional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            rows={4}
                            placeholder="Descreva sua experiência..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Enviar Avaliação</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
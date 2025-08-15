import React, { useState } from 'react';
import Modal from '../Modal'; // Usando o nosso componente de Modal genérico

type ReviewModalProps = {
    isOpen: boolean;
    onClose: () => void;
    restaurantName: string;
    restauranteId?: number;
    clienteId?: number;
    bookingId?: number;
    bookingHora?: string;
    onAvaliacaoFeita?: (bookingId: number) => void;
};

export default function ReviewModal({ isOpen, onClose, restaurantName, restauranteId, clienteId, bookingId, bookingHora, onAvaliacaoFeita }: ReviewModalProps) {

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError('');
        setSuccess('');
        if (!rating) {
            setError('Selecione uma nota.');
            return;
        }
        if (!restaurantName || restauranteId === undefined || clienteId === undefined) {
            setError('Dados insuficientes para avaliação.');
            return;
        }
        setLoading(true);
        try {
            const { createAvaliacao } = await import('../../utils');
            // Busca a reserva selecionada do estado global window.bookingHistory
            // Normaliza hora para HH:mm:ss
            function normalizaHora(hora: string | undefined) {
                if (!hora) return '';
                const partes = hora.split(':');
                return `${partes[0]?.padStart(2, '0') || '00'}:${partes[1]?.padStart(2, '0') || '00'}:${partes[2]?.padStart(2, '0') || '00'}`;
            }
            const horaFinal = normalizaHora(bookingHora);
            console.log('Enviando avaliação com hora:', horaFinal);
            await createAvaliacao({
                cliente_id: clienteId,
                restaurante_id: restauranteId,
                nota: rating,
                comentario: comment,
                data: new Date().toISOString().slice(0, 10),
                hora: horaFinal
            });
            setSuccess('Avaliação enviada com sucesso!');
            setTimeout(() => {
                setSuccess('');
                onClose();
                if (onAvaliacaoFeita && bookingId !== undefined) {
                    onAvaliacaoFeita(bookingId);
                }
            }, 500);
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar avaliação.');
        } finally {
            setLoading(false);
        }
    }

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
                                    disabled={loading}
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
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="text-red-600 mb-2 text-sm font-semibold">{error}</div>}
                    {success && <div className="text-green-600 mb-2 text-sm font-semibold">{success}</div>}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md font-semibold" disabled={loading}>Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold" disabled={loading}>Enviar Avaliação</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
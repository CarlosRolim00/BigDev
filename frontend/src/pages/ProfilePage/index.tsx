import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModal'; // 1. Importe o novo modal

// Dados mocados para o histórico
const bookingHistory = [
    { id: 1, restaurant_name: 'PollGreen Irish Pub', date: '25 Maio 2025 | 12:15 PM', people: '2 Pessoas', image: '/images/bar.jpg' },
    { id: 2, restaurant_name: 'São & Salvo Boteco', date: '17 Abril 2025 | 12:15 PM', people: '2 Pessoas', image: '/images/parmegiana.jpg' },
];

export default function ProfilePage() {
    // ... (seus outros estados não mudam)
    const [email, setEmail] = useState('seuemail@exemplo.com');
    const [name, setName] = useState('Seu Nome Completo');
    const [phone, setPhone] = useState('+55 99 99999-9999');

    // 2. Estados para controlar o modal de avaliação
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookingName, setSelectedBookingName] = useState('');

    const handleOpenReviewModal = (bookingName: string) => {
        setSelectedBookingName(bookingName);
        setIsReviewModalOpen(true);
    };

    return (
        <>
            <div className="bg-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Coluna do Formulário (não muda) */}
                    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                        <Link to="/homescreen" className="text-sm font-semibold mb-6 inline-block">&lt; Meu Perfil</Link>
                        <form className="space-y-6">
                            {/* ... campos do formulário ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Link to="/homescreen" className="flex-1">
                                    <button type="button" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Voltar</button>
                                </Link>
                                <button type="submit" className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">Salvar Mudanças</button>
                            </div>
                        </form>
                    </div>

                    {/* Coluna Direita: Histórico de Reservas */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Histórico de Reservas</h2>
                        <div className="space-y-4">
                            {bookingHistory.map((booking) => (
                                <div key={booking.id} className="flex flex-col sm:flex-row items-center border-b pb-4">
                                    <img src={booking.image} alt={booking.restaurant_name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0" />
                                    <div className="ml-4 flex-grow">
                                        <h3 className="font-bold">{booking.restaurant_name}</h3>
                                        <p className="text-sm text-gray-600">Reservado:</p>
                                        <p className="text-sm font-semibold">{booking.date}</p>
                                        <p className="text-sm font-semibold">{booking.people}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                                        <a href="#" className="text-sm text-red-600 font-semibold hover:underline text-center">Cancelar</a>
                                        {/* 3. Botão de Avaliar */}
                                        <button 
                                            onClick={() => handleOpenReviewModal(booking.restaurant_name)}
                                            className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
                                        >
                                            Avaliar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. O Modal é renderizado aqui */}
            <ReviewModal 
                isOpen={isReviewModalOpen} 
                onClose={() => setIsReviewModalOpen(false)} 
                restaurantName={selectedBookingName} 
            />
        </>
    );
}
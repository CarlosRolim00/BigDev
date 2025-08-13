import React, { useState } from 'react';
import { Search, Edit } from 'lucide-react';
import Modal from '../../components/Modal'; // 1. Importe o Modal

// Definindo um tipo para os dados da reserva
type Booking = {
    restaurant: string;
    client: string;
    date: string;
    time: string;
    people: number;
    status: 'Confirmada' | 'Cancelada';
    table?: number; // Adicionando a mesa como opcional
};

// Dados mocados para as reservas
const bookingsData: Booking[] = [
    { restaurant: 'PollGreen Irish Pub', client: 'Jhonatan G.', date: '2025-08-12', time: '12:15 PM', people: 2, status: 'Confirmada', table: 5 },
    { restaurant: 'Blu Méditerranée', client: 'Maria Souza', date: '2025-08-12', time: '19:30 PM', people: 4, status: 'Confirmada', table: 2 },
    { restaurant: 'São & Salvo Boteco', client: 'Carlos Pereira', date: '2025-08-11', time: '20:00 PM', people: 3, status: 'Cancelada', table: 8 },
];

const getStatusClass = (status: string) => {
    return status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
};

export default function MasterBookingsPage() {
    // 2. Estados para controlar o modal e os dados da reserva em edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

    // Função para abrir o modal com os dados da reserva selecionada
    const handleEditClick = (booking: Booking) => {
        setEditingBooking(booking);
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Reserva do cliente ${editingBooking?.client} atualizada!`);
        setIsEditModalOpen(false);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar por restaurante ou cliente..."
                            className="w-full px-4 py-2 border rounded-md"
                        />
                         <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-md"
                        />
                    </div>
                </div>

                {/* Tabela de Reservas */}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Restaurante</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Pessoas</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {bookingsData.map((booking, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{booking.restaurant}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.client}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.date} - {booking.time}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.people}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        {/* 3. Botão de editar agora abre o modal */}
                                        <button onClick={() => handleEditClick(booking)} className="text-gray-600 hover:text-blue-600" title="Editar Reserva">
                                            <Edit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Modal para Editar Reserva */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Editar Reserva</h2>
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Status da Reserva</label>
                            <select defaultValue={editingBooking?.status} className="w-full mt-1 p-2 border rounded-md bg-white">
                                <option>Confirmada</option>
                                <option>Cancelada</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Número de Pessoas</label>
                                <input type="number" defaultValue={editingBooking?.people} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Número da Mesa</label>
                                <input type="number" defaultValue={editingBooking?.table} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                             <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
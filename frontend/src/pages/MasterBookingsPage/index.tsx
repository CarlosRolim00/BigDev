import React, { useState, useEffect } from 'react';
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

import { getAllReservas } from '../../utils';

const getStatusClass = (status: string) => {
    return status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
};

export default function MasterBookingsPage() {
    // 2. Estados para controlar o modal e os dados da reserva em edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [bookingsData, setBookingsData] = useState<Booking[]>([]);
    const [searchRestaurant, setSearchRestaurant] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        setCurrentPage(1);
    }, [searchRestaurant, searchDate]);
    useEffect(() => {
        async function fetchReservas() {
            setLoading(true);
            setError('');
            try {
                const reservas = await getAllReservas();
                console.log('Reservas recebidas do backend:', reservas);
                // Mapear reservas do backend para o formato Booking
                const formatDate = (dateStr: string) => {
                    if (!dateStr) return '-';
                    const d = new Date(dateStr);
                    if (isNaN(d.getTime())) return dateStr;
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = String(d.getFullYear());
                    return `${day}/${month}/${year}`;
                };
                const formatTime = (timeStr: string) => {
                    if (!timeStr) return '-';
                    // Aceita hh:mm:ss ou hh:mm
                    const [h, m] = timeStr.split(':');
                    if (!h || !m) return timeStr;
                    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
                };
                const getRestaurantName = (r: any) => {
                    const name = (
                        r.restaurante_nome ||
                        r.nome_restaurante ||
                        r.restaurante_nome_fantasia ||
                        r.nome_fantasia ||
                        r.nome ||
                        (r.restaurante && (r.restaurante.nome || r.restaurante.nome_fantasia))
                    );
                    if (name) return name;
                    if (r.restaurante_id) return `ID: ${r.restaurante_id}`;
                    return '-';
                };
                const getClientName = (r: any) => {
                    const name = (
                        r.cliente_nome ||
                        r.nome_cliente ||
                        r.nome ||
                        (r.cliente && (r.cliente.nome || r.cliente.nome_completo))
                    );
                    if (name) return name;
                    if (r.cliente_id) return `ID: ${r.cliente_id}`;
                    return '-';
                };
                const mapped = reservas.map((r: any) => ({
                    restaurant: getRestaurantName(r),
                    client: getClientName(r),
                    date: formatDate(r.dia || r.data || '-'),
                    time: formatTime(r.hora || '-'),
                    people: r.qtd_pessoas || r.pessoas || r.qtd || r.qtd_pessoa || 1,
                    status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1).toLowerCase()) : '-',
                    table: r.mesa_id || r.table || undefined,
                    rawTime: r.hora || '-'
                }));
                console.log('Reservas mapeadas:', mapped);
                setBookingsData(mapped);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar reservas');
            } finally {
                setLoading(false);
            }
        }
        fetchReservas();
    }, []);


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

    // Resetar página ao filtrar
    useEffect(() => {
        setCurrentPage(1);
    }, [searchRestaurant, searchDate]);


    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Gerenciar Reservas</h2>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar por restaurante..."
                            className="w-full px-4 py-2 border rounded-md"
                            value={searchRestaurant}
                            onChange={e => setSearchRestaurant(e.target.value)}
                        />
                        <input
                            type="date"
                            className="w-full px-4 py-2 border rounded-md"
                            value={searchDate}
                            onChange={e => setSearchDate(e.target.value)}
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
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Pessoas</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-6">Carregando reservas...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={6} className="text-center text-red-500 py-6">{error}</td></tr>
                            ) : bookingsData.length === 0 ? (
                                <tr><td colSpan={6} className="text-center text-gray-500 py-6">Nenhuma reserva encontrada.</td></tr>
                            ) : (() => {
                                const filtered = bookingsData.filter(booking => {
                                    const restaurantMatch = booking.restaurant.toLowerCase().includes(searchRestaurant.toLowerCase());
                                    const dateMatch = searchDate
                                        ? (() => {
                                            // searchDate: yyyy-mm-dd, booking.date: dd/mm/yyyy
                                            const [year, month, day] = searchDate.split('-');
                                            const searchFormatted = `${day}/${month}/${year}`;
                                            return booking.date === searchFormatted;
                                        })()
                                        : true;
                                    return restaurantMatch && dateMatch;
                                });
                                const totalPages = Math.ceil(filtered.length / pageSize);
                                const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
                                return <>
                                    {paginated.map((booking, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-4 whitespace-nowrap font-medium">{booking.restaurant}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.client}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.date}</td>
                                            <td className="py-4 px-4 whitespace-nowrap text-gray-600">{booking.time}</td>
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
                                    {/* Paginação */}
                                    {totalPages > 1 && (
                                        <tr>
                                            <td colSpan={7} className="pt-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                    >Anterior</button>
                                                    <span className="px-2">Página {currentPage} de {totalPages}</span>
                                                    <button
                                                        className="px-3 py-1 border rounded disabled:opacity-50"
                                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                        disabled={currentPage === totalPages}
                                                    >Próxima</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>;
                            })()}
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
import { useEffect, useState } from 'react';
import { Users, Clock } from 'lucide-react';
import { getReservasByRestaurante } from '../../utils';
import { getTablesByRestaurante, addTable } from '../../utils';
import Modal from '../../components/Modal'; // 1. Importe o Modal

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Disponível': return 'bg-green-500';
        case 'Reservado': return 'bg-orange-500';
        case 'Ocupado': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

export default function xAdminReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().substring(0, 10));
    
    // 2. Estado para controlar o modal de adicionar mesa
    const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
    const [newTable, setNewTable] = useState({ numero: '', capacidade: '', localizacao: 'dentro' });
    const [selectedLocation, setSelectedLocation] = useState('dentro');

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) {
            setError('Restaurante não identificado.');
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all([
            getReservasByRestaurante(restaurante_id, selectedDate),
            getTablesByRestaurante(restaurante_id)
        ])
            .then(([reservas, mesas]) => {
                setReservations(reservas);
                setTables(mesas);
            })
            .catch((err) => {
                setError('Erro ao buscar reservas ou mesas do restaurante');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [selectedDate]);

    const handleAddTableSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) {
            alert('Restaurante não identificado.');
            return;
        }
        try {
            await addTable(
                restaurante_id,
                newTable.numero,
                newTable.capacidade,
                newTable.localizacao
            );
            // Atualiza lista de mesas após adicionar
            const mesasAtualizadas = await getTablesByRestaurante(restaurante_id);
            setTables(mesasAtualizadas);
            setNewTable({ numero: '', capacidade: '', localizacao: 'dentro' });
            setIsAddTableModalOpen(false);
        } catch (err: any) {
            alert(err.message || 'Erro ao adicionar mesa');
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna da Esquerda: Reservas */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Reservas</h2>
                    <input
                        type="date"
                        className="w-full p-2 border rounded-md mb-6"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                    {loading ? (
                        <div>Carregando reservas...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            {reservations.length === 0 ? (
                                <div className="text-gray-500 text-center">Nenhuma reserva encontrada.</div>
                            ) : (
                                reservations.map((res, index) => (
                                    <div key={index} className="border rounded-md p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold">{res.nome_cliente || res.cliente_id}</h3>
                                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">{res.status}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                            <span className="flex items-center gap-2"><Users size={16} /> {res.qtd_pessoas || '-'} Pessoas</span>
                                            <span className="flex items-center gap-2"><Clock size={16} /> {res.hora || '-'}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Coluna da Direita: Salão */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Salão</h2>
                        <select className="p-2 border rounded-md" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
                            <option value="dentro">Salão Principal</option>
                            <option value="fora">Área Externa</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 border rounded-md">
                        {tables.length === 0 ? (
                            <div className="col-span-4 text-center text-gray-500">Nenhuma mesa cadastrada.</div>
                        ) : (
                            tables
                                .filter((mesa: any) => mesa.localizacao === selectedLocation)
                                .map((mesa: any) => {
                                    // Verifica se existe reserva para esta mesa na data selecionada
                                    const reserva = reservations.find(r => r.mesa_id === mesa.id && r.status !== 'Cancelada');
                                    let status = 'Disponível';
                                    if (reserva && reserva.status === 'Reservado') status = 'Reservado';
                                    return (
                                        <div key={mesa.id} className={`p-4 rounded-md text-white text-center ${getStatusClass(status)}`}>
                                            <p className="font-bold text-lg">{mesa.numero}</p>
                                            <p className="text-xs">{status}</p>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                    <div className="text-right mt-4">
                        {/* 3. Botão agora abre o modal */}
                        <button onClick={() => setIsAddTableModalOpen(true)} className="bg-black text-white px-4 py-2 rounded-md font-semibold">
                            Adicionar Mesa
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Modal para Adicionar Mesa */}
            <Modal isOpen={isAddTableModalOpen} onClose={() => setIsAddTableModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Adicionar Nova Mesa</h2>
                    <form className="space-y-4" onSubmit={handleAddTableSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Número da Mesa</label>
                            <input type="number" name="numero" value={newTable.numero} onChange={e => setNewTable({ ...newTable, numero: e.target.value })} placeholder="Ex: 15" className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Número de Pessoas</label>
                            <input type="number" name="capacidade" value={newTable.capacidade} onChange={e => setNewTable({ ...newTable, capacidade: e.target.value })} placeholder="Ex: 4" className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Localização</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="location" value="dentro" checked={newTable.localizacao === 'dentro'} onChange={() => setNewTable({ ...newTable, localizacao: 'dentro' })} /> Dentro
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="location" value="fora" checked={newTable.localizacao === 'fora'} onChange={() => setNewTable({ ...newTable, localizacao: 'fora' })} /> Fora
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={() => setIsAddTableModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                             <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Adicionar Mesa</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
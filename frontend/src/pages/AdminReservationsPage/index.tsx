import { useEffect, useState } from 'react';
import { Users, Clock } from 'lucide-react';
import { getReservasByRestaurante } from '../../utils';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Disponível': return 'bg-green-500';
        case 'Reservado': return 'bg-orange-500';
        case 'Ocupado': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().substring(0, 10));

    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) {
            setError('Restaurante não identificado.');
            setLoading(false);
            return;
        }
        setLoading(true);
        console.log('Buscando reservas para restaurante', restaurante_id, 'na data', selectedDate);
        getReservasByRestaurante(restaurante_id, selectedDate)
            .then(data => {
                console.log('Reservas recebidas:', data);
                setReservations(data);
            })
            .catch((err) => {
                setError('Erro ao buscar reservas do restaurante');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [selectedDate]);

    return (
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

            {/* Coluna da Direita: Salão (mantém dados mocados por enquanto) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Salão</h2>
                    <select className="p-2 border rounded-md">
                        <option>Salão Principal</option>
                        <option>Área Externa</option>
                    </select>
                </div>
                {/* Aqui você pode integrar as mesas reais depois */}
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4 p-4 border rounded-md">
                    {[1,2,3,4,5,6].map(id => (
                        <div key={id} className={`p-4 rounded-md text-white text-center ${getStatusClass('Disponível')}`}>
                            <p className="font-bold text-lg">{id}</p>
                            <p className="text-xs">Disponível</p>
                        </div>
                    ))}
                </div>
                <div className="text-right mt-4">
                    <button className="bg-black text-white px-4 py-2 rounded-md font-semibold">Adicionar Mesa</button>
                </div>
            </div>
        </div>
    );
}
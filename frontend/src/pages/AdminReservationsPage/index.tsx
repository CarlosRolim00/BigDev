import { useEffect, useState } from 'react';
import { Users, Clock } from 'lucide-react';
import { getReservasByRestaurante } from '../../utils';
import { API_BASE_URL } from '../../utils';
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

export default function AdminReservationsPage() {
    // Estado para avaliações e média
    const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
    const [mediaAvaliacao, setMediaAvaliacao] = useState<number | null>(null);
    const [clientesAvaliacao, setClientesAvaliacao] = useState<{[key: number]: string}>({});
    const [paginaAvaliacoes, setPaginaAvaliacoes] = useState(1);
    const AVALIACOES_POR_PAGINA = 3;

    // Filtro de horários disponíveis
    const [horarioFiltro, setHorarioFiltro] = useState('');
    // Paginação
    const [pagina, setPagina] = useState(1);
    const RESERVAS_POR_PAGINA = 6;

    // ...existing code...
    const [reservations, setReservations] = useState<any[]>([]);
    const [tables, setTables] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().substring(0, 10));
    const [selectedTime, setSelectedTime] = useState<string>('');   
    
    // 2. Estado para controlar o modal de adicionar mesa
    const [isAddTableModalOpen, setIsAddTableModalOpen] = useState(false);
    const [newTable, setNewTable] = useState({ numero: '', capacidade: '', localizacao: 'dentro' });
    const [selectedLocation, setSelectedLocation] = useState('dentro');

    // Atualiza reservas e mesas ao mudar data, cadastrar mesa, fechar modal, trocar horário ou salão
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
            getTablesByRestaurante(restaurante_id),
            // Busca avaliações do restaurante
            fetch(`${API_BASE_URL}/avaliacao?restaurante_id=${restaurante_id}`).then(res => res.json())
        ])
            .then(async ([reservas, mesas, avaliacoesRest]) => {
                setReservations(reservas);
                setTables(mesas);
                // Avaliações e média
                setAvaliacoes(avaliacoesRest);
                if (avaliacoesRest.length > 0) {
                    const soma = avaliacoesRest.reduce((acc: number, a: any) => acc + (a.nota || 0), 0);
                    setMediaAvaliacao(Number((soma / avaliacoesRest.length).toFixed(2)));
                } else {
                    setMediaAvaliacao(null);
                }
                // Fetch client names for reviews
                const clienteMap: {[key: number]: string} = {};
                for (const a of avaliacoesRest) {
                    if (a.cliente_id && !clienteMap[a.cliente_id]) {
                        try {
                            const cliente = await fetch(`${API_BASE_URL}/cliente/${a.cliente_id}`).then(r => r.json());
                            clienteMap[a.cliente_id] = cliente.nome || `Cliente ${a.cliente_id}`;
                        } catch {
                            clienteMap[a.cliente_id] = `Cliente ${a.cliente_id}`;
                        }
                    }
                }
                setClientesAvaliacao(clienteMap);
                // ...existing code...
                if (selectedTime) {
                    const mesasDisponiveis = mesas.filter((mesa: any) => {
                        const reserva = reservas.find((r: any) => r.mesa_id === mesa.id && r.hora === selectedTime && (
                            r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                        ));
                        return !reserva;
                    });
                    if (mesasDisponiveis.length === 0) {
                        setSelectedTime('');
                    }
                }
            })
            .catch(() => {
                setError('Erro ao buscar reservas, mesas ou avaliações do restaurante');
            })
            .finally(() => setLoading(false));
    }, [selectedDate, isAddTableModalOpen, selectedTime, selectedLocation]);

    const handleAddTableSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) {
            alert('Restaurante não identificado.');
            return;
        }
        // Verifica se já existe reserva para esta mesa no horário selecionado
        if (selectedTime) {
            const reservaExistente = reservations.find(r => r.mesa_id === Number(newTable.numero) && r.hora === selectedTime && r.status !== 'Cancelada');
            if (reservaExistente) {
                alert('Esta mesa já está reservada para o horário selecionado. Escolha outro horário ou mesa.');
                return;
            }
        }
        try {
            await addTable(
                restaurante_id,
                newTable.numero,
                newTable.capacidade,
                newTable.localizacao
            );
            setNewTable({ numero: '', capacidade: '', localizacao: 'dentro' });
            setIsAddTableModalOpen(false); // Isso dispara o useEffect para atualizar reservas/mesas
        } catch (err: any) {
            alert(err.message || 'Erro ao adicionar mesa');
        }
    }


    // Horários disponíveis vindos do banco
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

    useEffect(() => {
        async function fetchHorarios() {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            if (!restaurante_id) return;
            try {
                const restaurante = await import('../../utils').then(utils => utils.getRestauranteById(restaurante_id));
                setHorariosDisponiveis(restaurante.times || []);
            } catch {
                setHorariosDisponiveis([]);
            }
        }
        fetchHorarios();
    }, []);
    // ...existing code...
    console.log(horariosDisponiveis);
    const horariosComMesas = horariosDisponiveis.map(horario => {
        const mesaDisponivel = tables.some((mesa: any) => {
            const reserva = reservations.find((r: any) => r.mesa_id === mesa.id && r.hora === horario && (
                r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
            ));
            return !reserva;
        });
        return { horario, disponivel: mesaDisponivel };
    });
    // Handler para cancelar reserva
    const handleCancelarReserva = async (id: number) => {
        try {
            const reservaAtual = reservations.find(r => r.id === id);
            if (!reservaAtual) throw new Error('Reserva não encontrada');
            const url = `${API_BASE_URL}/reserva/${id}`;
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_id: reservaAtual.cliente_id,
                    mesa_id: reservaAtual.mesa_id,
                    hora: reservaAtual.hora,
                    dia: reservaAtual.dia,
                    status: 'cancelada',
                    observacao: reservaAtual.observacao ?? '',
                })
            });
            // Atualiza reservas do banco
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            if (restaurante_id && selectedDate) {
                const novasReservas = await getReservasByRestaurante(restaurante_id, selectedDate);
                setReservations(novasReservas);
            }
        } catch {
            alert('Erro ao cancelar reserva');
        }
    };

    // Handler para confirmar reserva
    const handleConfirmarReserva = async (id: number) => {
        try {
            const reservaAtual = reservations.find(r => r.id === id);
            if (!reservaAtual) throw new Error('Reserva não encontrada');
            const url = `${API_BASE_URL}/reserva/${id}`;
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_id: reservaAtual.cliente_id,
                    mesa_id: reservaAtual.mesa_id,
                    hora: reservaAtual.hora,
                    dia: reservaAtual.dia,
                    status: 'confirmada',
                    observacao: reservaAtual.observacao ?? '',
                })
            });
            // Atualiza reservas do banco
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            if (restaurante_id && selectedDate) {
                const novasReservas = await getReservasByRestaurante(restaurante_id, selectedDate);
                setReservations(novasReservas);
            }
        } catch {
            alert('Erro ao confirmar reserva');
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna da Esquerda: Reservas */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Reservas</h2>
                    <input
                        type="date"
                        className="w-full p-2 border rounded-md mb-4"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                    <div className="mb-6 flex gap-2 flex-wrap items-center">
                        <label className="text-sm font-semibold mr-2">Filtrar horário:</label>
                        <select
                            className="p-2 border rounded-md text-sm"
                            value={horarioFiltro}
                            onChange={e => {
                                setHorarioFiltro(e.target.value);
                                setPagina(1);
                            }}
                        >
                            <option value="">Todos</option>
                            {horariosDisponiveis.map(horario => (
                                <option key={horario} value={horario}>{horario}</option>
                            ))}
                        </select>
                    </div>
                    {loading ? (
                        <div>Carregando reservas...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            {reservations.length === 0 ? (
                                <div className="text-gray-500 text-center">Nenhuma reserva encontrada.</div>
                            ) : (
                                (() => {
                                    const normalizarHorario = (h: string) => {
                                        if (!h) return '';
                                        // Aceita formatos HH:mm, HH:mm:ss, Date, etc
                                        const partes = h.split(':');
                                        if (partes.length >= 2) {
                                            return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
                                        }
                                        return h;
                                    };
                                    const filtradas = horarioFiltro
                                        ? reservations.filter(r => normalizarHorario(r.hora) === normalizarHorario(horarioFiltro))
                                        : reservations;
                                    const totalPaginas = Math.max(1, Math.ceil(filtradas.length / RESERVAS_POR_PAGINA));
                                    const inicio = (pagina - 1) * RESERVAS_POR_PAGINA;
                                    const fim = inicio + RESERVAS_POR_PAGINA;
                                    return <>
                                        {filtradas.length === 0 ? (
                                            <div className="text-gray-500 text-center">Nenhuma reserva para este horário.</div>
                                        ) : (
                                            filtradas.slice(inicio, fim).map((res, index) => (
                                                <div key={index} className="border rounded-md p-4">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold">{res.nome_cliente || res.cliente_nome || '-'}</h3>
                                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 ${
                                                            res.status === 'cancelada' ? 'bg-red-100 text-red-600' :
                                                            res.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                                            res.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-200 text-gray-600'
                                                        }`}>
                                                            {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                                                        <span className="flex items-center gap-2"><Users size={16} /> {res.qtd_pessoas ?? '-'}</span>
                                                        <span className="flex items-center gap-2"><Clock size={16} /> {res.hora || '-'}</span>
                                                        <span className="flex items-center gap-2">Mesa: <span className="font-bold">{res.numero ?? '-'}</span></span>
                                                    </div>
                                                    {(res.status !== 'cancelada' && res.status !== 'confirmada') && (
                                                        <div className="flex gap-2 mt-3">
                                                            <button
                                                                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-700"
                                                                onClick={() => handleCancelarReserva(res.id)}
                                                            >Cancelar</button>
                                                            <button
                                                                className="px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-700"
                                                                onClick={() => handleConfirmarReserva(res.id)}
                                                            >Confirmar</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button
                                                className="px-2 py-1 rounded border"
                                                disabled={pagina === 1}
                                                onClick={() => setPagina(p => Math.max(1, p - 1))}
                                            >Anterior</button>
                                            <span className="px-2 py-1">Página {pagina} de {totalPaginas}</span>
                                            <button
                                                className="px-2 py-1 rounded border"
                                                disabled={pagina === totalPaginas}
                                                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                                            >Próxima</button>
                                        </div>
                                    </>;
                                })()
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
                                .sort((a: any, b: any) => Number(a.numero) - Number(b.numero))
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
                        <button onClick={() => setIsAddTableModalOpen(true)} className="bg-black text-white px-4 py-2 rounded-md font-semibold">
                            Adicionar Mesa
                        </button>
                    </div>
                    {/* Seção de avaliações e média */}
                    <div className="mt-8 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-2">Avaliações do Restaurante</h2>
                        {mediaAvaliacao !== null ? (
                            <div className="mb-4 text-lg font-semibold text-yellow-600 flex items-center gap-2">
                                Média: {mediaAvaliacao} / 5
                                <span>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span key={i} className={i < Math.round(mediaAvaliacao) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                    ))}
                                </span>
                            </div>
                        ) : (
                            <div className="mb-4 text-gray-500">Nenhuma avaliação ainda.</div>
                        )}
                        <div className="space-y-4">
                            {avaliacoes.length === 0 ? (
                                <div className="text-gray-500">Nenhuma avaliação encontrada.</div>
                            ) : (
                                (() => {
                                    const totalPaginasAvaliacoes = Math.max(1, Math.ceil(avaliacoes.length / AVALIACOES_POR_PAGINA));
                                    const inicio = (paginaAvaliacoes - 1) * AVALIACOES_POR_PAGINA;
                                    const fim = inicio + AVALIACOES_POR_PAGINA;
                                    const avaliacoesPaginadas = avaliacoes.slice().reverse().slice(inicio, fim);
                                    return <>
                                        {avaliacoesPaginadas.map((a, idx) => {
                                            // ...debug logs if needed...
                                            return (
                                                <div key={idx} className="border-b pb-3 mb-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {/* Estrelas da nota */}
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={i < a.nota ? 'text-yellow-400 text-xl' : 'text-gray-300 text-xl'}>★</span>
                                                        ))}
                                                    </div>
                                                    <div className="text-gray-700 mb-1 italic">{a.comentario}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {a.nome_cliente ? `Cliente: ${a.nome_cliente}` : a.cliente_nome ? `Cliente: ${a.cliente_nome}` : (clientesAvaliacao[a.cliente_id] ? `Cliente: ${clientesAvaliacao[a.cliente_id]}` : (a.cliente_id ? `Cliente: ${a.cliente_id}` : ''))}
                                                        {a.data ? ` | Data: ${a.data.slice(0,10)}` : ''}
                                                        {a.observacao ? ` | Observação: ${a.observacao}` : ''}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="flex justify-center gap-2 mt-2">
                                            <button
                                                className="px-2 py-1 rounded border"
                                                disabled={paginaAvaliacoes === 1}
                                                onClick={() => setPaginaAvaliacoes(p => Math.max(1, p - 1))}
                                            >Anterior</button>
                                            <span className="px-2 py-1">Página {paginaAvaliacoes} de {totalPaginasAvaliacoes}</span>
                                            <button
                                                className="px-2 py-1 rounded border"
                                                disabled={paginaAvaliacoes === totalPaginasAvaliacoes}
                                                onClick={() => setPaginaAvaliacoes(p => Math.min(totalPaginasAvaliacoes, p + 1))}
                                            >Próxima</button>
                                        </div>
                                    </>;
                                })()
                            )}
                        </div>
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
                            <input
                                type="number"
                                name="numero"
                                value={newTable.numero}
                                onChange={e => setNewTable({ ...newTable, numero: e.target.value })}
                                placeholder="Ex: 15"
                                className="w-full mt-1 p-2 border rounded-md"
                                required
                                disabled={!selectedTime || reservations.some((r: any) => r.mesa_id === Number(newTable.numero) && r.hora === selectedTime && (
                                    r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                                ))}
                            />
                            {!selectedTime && (
                                <span className="text-xs text-blue-500">Selecione um horário antes de cadastrar a mesa.</span>
                            )}
                            {selectedTime && reservations.some((r: any) => r.mesa_id === Number(newTable.numero) && r.hora === selectedTime && (
                                r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                            )) && (
                                <span className="text-xs text-red-500">Esta mesa já está reservada para o horário selecionado.</span>
                            )}
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
                             <button
                                 type="submit"
                                 className="px-4 py-2 bg-black text-white rounded-md font-semibold"
                                 disabled={
                                     !selectedTime ||
                                     reservations.some((r: any) => r.mesa_id === Number(newTable.numero) && r.hora === selectedTime && (
                                         r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                                     ))
                                 }
                             >Adicionar Mesa</button>
                        </div>
                    </form>
                </div>
            </Modal>

            
        </>
    );
}
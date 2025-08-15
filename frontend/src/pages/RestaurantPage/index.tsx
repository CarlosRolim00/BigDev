import { useEffect, useState } from "react";

// Função utilitária para garantir formato hh:mm
function formatHour(h: string | undefined): string {
    if (!h) return '--:--';
    const match = h.match(/^(\d{1,2}):(\d{2})/);
    if (!match) return h;
    const [_, hour, min] = match;
    return `${hour.padStart(2, '0')}:${min}`;
}
import { useParams, Link } from "react-router-dom";
import { getRestauranteById, API_BASE_URL, getCardapios } from '../../utils';
import { MapPin, Clock, Utensils, Send } from "lucide-react";
import LocationCard from "../../components/LocationCard";
import OfficialSitesCard from "../../components/OfficialSitesCard";


import Modal from '../../components/Modal';

function RestaurantPage() {
    // Atualiza o modal de seleção de mesa ao trocar o horário

    const [mesaModalOpen, setMesaModalOpen] = useState(false);
    type Mesa = { id: number; numero: number; capacidade: number; status: string; local?: string };
    const [mesasLivres, setMesasLivres] = useState<Mesa[]>([]);
    const [reservaMesaId, setReservaMesaId] = useState(null);
    const [reservaMesaLocal, setReservaMesaLocal] = useState('dentro');
    // Preenche dados do cliente logado ao abrir o modal de reserva
    // Preenche dados do cliente logado ao abrir o modal de reserva, mas só se os campos estiverem vazios
    const preencherDadosCliente = async () => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        setReservaNome(usuarioLogado?.nome || '');
        setReservaEmail(usuarioLogado?.email || '');
        setReservaTelefone(usuarioLogado?.telefone || '');
        if (usuarioLogado && usuarioLogado.id) {
            try {
                const utils = await import('../../utils');
                const cliente = await utils.getClienteByUsuarioId(usuarioLogado.id);
                if (cliente) {
                    setReservaNome(cliente.nome || usuarioLogado.nome || '');
                    setReservaEmail(cliente.email || usuarioLogado.email || '');
                    setReservaTelefone(cliente.telefone || usuarioLogado.telefone || '');
                }
            } catch {
                // Se não encontrar cliente, mantém dados do usuário
            }
        }
    };
    const [reservaData, setReservaData] = useState(() => {
        const hoje = new Date();
        return hoje.toISOString().slice(0, 10);
    });
    // ...existing code...
    // Estado para modal de reserva
    const [reservaModalOpen, setReservaModalOpen] = useState(false);
    const [reservaHorario, setReservaHorario] = useState<string | null>(null);
    const [reservaTelefone, setReservaTelefone] = useState('');
    const [reservaNome, setReservaNome] = useState('');
    const [reservaEmail, setReservaEmail] = useState('');
    const [reservaPessoas, setReservaPessoas] = useState(2);
    const [reservaSuccess, setReservaSuccess] = useState('');
    const [reservaError, setReservaError] = useState('');
    const [reservaObservacao, setReservaObservacao] = useState('');

    // Limpa seleção de mesa ao trocar o horário, se o modal de mesa estiver aberto
    useEffect(() => {
        if (mesaModalOpen) {
            setReservaMesaId(null);
            setReservaMesaLocal('dentro');
        }
    }, [reservaHorario, mesaModalOpen]);
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [cardapios, setCardapios] = useState<any[]>([]);
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const [reservas, setReservas] = useState<any[]>([]);
    useEffect(() => {
        // Buscar mesas livres do restaurante
        if (id) {
            fetch(`${API_BASE_URL}/mesa/restaurante/${id}`)
                .then(res => res.json())
                .then(data => setMesasLivres(data.filter((mesa: any) => mesa.status === 'disponivel')))
                .catch(() => setMesasLivres([]));
        }
        if (id) {
            getRestauranteById(Number(id))
                .then(data => {
                    setRestaurant({
                        id: data.id,
                        name: data.nome,
                        address: data.endereco,
                        hours: (data.horario_abertura && data.horario_fechamento)
                            ? `${formatHour(data.horario_abertura)} - ${formatHour(data.horario_fechamento)}`
                            : '11:00 - 22:00',
                        image: `${API_BASE_URL}/restaurante/${data.id}/imagem?v=${Date.now()}`,
                        ...data
                    });
                })
                .catch(() => setErro('Erro ao buscar restaurante'))
                .finally(() => setLoading(false));
        }
        // Buscar reservas do restaurante para a data selecionada
        if (id && reservaData) {
            fetch(`${API_BASE_URL}/reserva/restaurante/${id}?dia=${reservaData}`)
                .then(res => res.json())
                .then(data => setReservas(Array.isArray(data) ? data : []))
                .catch(() => setReservas([]));
        }
    }, [id, reservaData]);

    // Atualiza reservas ao abrir o modal de mesa
    useEffect(() => {
        if (mesaModalOpen && id && reservaData) {
            fetch(`${API_BASE_URL}/reserva/restaurante/${id}?dia=${reservaData}`)
                .then(res => res.json())
                .then(data => setReservas(Array.isArray(data) ? data : []))
                .catch(() => setReservas([]));
        }
    }, [mesaModalOpen, id, reservaData]);

    if (loading) return <div>Carregando restaurante...</div>;
    if (erro) return <div className="text-red-500">{erro}</div>;
    if (!restaurant) {
        return <div>Restaurante não encontrado.</div>;
    }

    // Função para verificar se há mesas livres para um horário
    function horarioDisponivel(time: string) {
        // Se não há mesas livres, retorna false
        if (!mesasLivres || mesasLivres.length === 0) return false;
        // Verifica se existe pelo menos uma mesa livre para o horário selecionado
        // Considera reservas para o horário e status pendente/confirmada
        const mesasDisponiveis = mesasLivres.filter((mesa: any) => {
            const reserva = reservas.find((r: any) => {
                // Extrai apenas horas e minutos do campo hora
                const reservaHora = r.hora ? r.hora.slice(0,5) : '';
                return r.mesa_id === mesa.id && reservaHora === time && (
                    r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                );
            });
            return !reserva;
        });
        // Se não há mesas disponíveis, bloqueia o botão
        return mesasDisponiveis.length > 0;
    }
    return (
        <>
            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-gray-100">
                <div className="flex-1">
                    <Link to="/homescreen" className="text-sm font-semibold mb-4 inline-block">&lt; Voltar</Link>
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-center mb-4">
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="max-w-2xl w-full h-72 object-cover rounded-xl shadow-lg border-2 border-gray-200 bg-gray-100"
                                        style={{ imageRendering: 'auto' }}
                                        onError={e => (e.currentTarget.src = '/images/peixes.jpg')}
                                    />
                                </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <MapPin size={20} className="mr-3 mt-1 text-gray-500"/>
                                    <p>{restaurant.address}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center font-semibold text-sm whitespace-nowrap text-blue-700 hover:text-blue-900"
                                >
                                    <Send size={16} className="mr-2"/>
                                    Mostrar Localização
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Clock size={20} className="mr-3 text-gray-500"/>
                                <p className="font-semibold text-black">{restaurant.hours}</p>
                            </div>
                            <div className="flex items-center">
                                <Utensils size={20} className="mr-3 text-gray-500"/>
                                <button
                                    className="underline cursor-pointer font-semibold text-blue-700 hover:text-blue-900"
                                    onClick={async () => {
                                        setMenuModalOpen(true);
                                        try {
                                            const all = await getCardapios();
                                            setCardapios(all.filter((c: any) => c.restaurante_id === restaurant.id));
                                        } catch {}
                                    }}
                                >
                                    Menu
                                </button>
                            </div>
                        </div>
                        <div className="border-t my-6"></div>
                        <div>
                            <h3 className="font-semibold mb-3">Horários disponíveis</h3>
                            <div className="flex flex-wrap gap-3">
                                {restaurant.times && [...restaurant.times]
                                    .sort((a: string, b: string) => {
                                        // Ordena por hora/minuto
                                        const [ah, am] = a.split(':').map(Number);
                                        const [bh, bm] = b.split(':').map(Number);
                                        return ah !== bh ? ah - bh : (am || 0) - (bm || 0);
                                    })
                                    .map((time: string) => {
                                        const disponivel = horarioDisponivel(time);
                                        return (
                                            <button
                                                key={time}
                                                className={`px-4 py-2 rounded-md font-semibold transition ${disponivel ? 'bg-gray-200 text-black hover:bg-blue-600 hover:text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                                disabled={!disponivel}
                                                onClick={disponivel ? async () => {
                                                    setReservaHorario(time);
                                                    setReservaSuccess('');
                                                    setReservaError('');
                                                    setReservaMesaId(null);
                                                    setReservaMesaLocal('dentro');
                                                    await preencherDadosCliente();
                                                    setReservaModalOpen(true);
                                                } : undefined}
                                                tabIndex={disponivel ? 0 : -1}
                                                aria-disabled={!disponivel}
                                                style={!disponivel ? { pointerEvents: 'none' } : {}}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                            </div>
            {/* Modal de Reserva */}
            <Modal isOpen={reservaModalOpen} onClose={() => setReservaModalOpen(false)}>
                <div className="p-8 max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-2xl border border-gray-100">
                    <button className="mb-4 text-sm text-gray-500 hover:text-black flex items-center gap-2" onClick={() => setReservaModalOpen(false)}>
                        <span className="text-xl">&larr;</span> Voltar
                    </button>
                    <h2 className="text-xl font-bold mb-2 text-gray-900"><span>{restaurant.name}</span> <span className="font-normal text-gray-700">Boteco</span></h2>
                    <hr className="my-4" />
                    <div className="flex items-center gap-3 mb-4">
                        <Clock size={20} className="text-gray-500" />
                        <input type="date" value={reservaData} onChange={e => setReservaData(e.target.value)} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        <span className="ml-2 font-semibold text-gray-800">{reservaHorario}</span>
                    </div>
                    <div className="mb-3 relative">
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Telefone</label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={reservaTelefone}
                                onChange={e => setReservaTelefone(e.target.value)}
                                className="w-full p-2 pl-10 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white placeholder-gray-400 text-sm"
                                placeholder="16538552163"
                                maxLength={15}
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                                {/* Bandeira do Brasil SVG */}
                                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="14" cy="14" r="14" fill="#3CB371"/>
                                    <rect x="6" y="10" width="16" height="8" rx="4" fill="#FFCC29" transform="rotate(15 14 14)" />
                                    <ellipse cx="14" cy="14" rx="6" ry="6" fill="#3CB371" />
                                    <ellipse cx="14" cy="14" rx="4.5" ry="4.5" fill="#3C5A99" />
                                    <path d="M10.5 14C10.5 14 12.5 13 14 14.5C15.5 16 17.5 14 17.5 14" stroke="white" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Nome Completo</label>
                        <input type="text" value={reservaNome} onChange={e => setReservaNome(e.target.value)} className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm" placeholder="Bob Smith" />
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Email <span className="text-gray-400 font-normal">(Opcional)</span></label>
                        <input type="email" value={reservaEmail} onChange={e => setReservaEmail(e.target.value)} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-50 placeholder-gray-400 text-sm transition-all duration-150" placeholder="Bob.smith@gmail.com" />
                    </div>
                    <div className="mb-3">
                        <label className="block text-xs font-semibold mb-1 text-gray-700">Observação <span className="text-gray-400 font-normal">(Preferências, alergias, pedidos especiais...)</span></label>
                        <textarea
                            value={reservaObservacao}
                            onChange={e => setReservaObservacao(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 bg-gray-50 placeholder-gray-400 text-sm resize-none min-h-[40px] transition-all duration-150"
                            placeholder="Ex: Prefiro mesa perto da janela, sou alérgico a frutos do mar..."
                        />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="font-semibold text-gray-700 text-xs">{reservaPessoas} Pessoas</span>
                        <input type="number" min={1} max={20} value={reservaPessoas} onChange={e => setReservaPessoas(Number(e.target.value))} className="w-14 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2 text-gray-700">Mesa</label>
                        <button
                            type="button"
                            className={`w-full px-4 py-3 rounded-lg border font-semibold shadow-sm transition-all ${reservaMesaId ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'}`}
                            onClick={() => setMesaModalOpen(true)}
                        >
                            {reservaMesaId ? `Mesa ${mesasLivres.find(m => m.id === reservaMesaId)?.numero || reservaMesaId}` : 'Selecionar Mesa'}
                        </button>
                        {reservaMesaId && (
                            <div className="mt-2 text-sm text-gray-700">Local selecionado: <span className="font-bold">{reservaMesaLocal === 'dentro' ? 'Interior' : 'Fora'}</span></div>
                        )}
            {/* Modal de Seleção de Mesa */}
            <Modal isOpen={mesaModalOpen} onClose={() => {
                setMesaModalOpen(false);
                setReservaMesaId(null);
                setReservaMesaLocal('dentro');
            }}>
                <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900">Selecione uma Mesa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mesasLivres.length === 0 ? (
                            <span className="text-gray-400">Nenhuma mesa disponível.</span>
                        ) : (
                            mesasLivres.map((mesa: any) => {
                                // Verifica se a mesa está ocupada para o horário selecionado
                                const ocupada = reservas.some((r: any) => {
                                    const reservaHora = r.hora ? r.hora.slice(0,5) : '';
                                    return r.mesa_id === mesa.id && reservaHora === reservaHorario && (
                                        r.status?.toLowerCase() === 'confirmada' || r.status?.toLowerCase() === 'pendente'
                                    );
                                });
                                return (
                                    <button
                                        key={mesa.id}
                                        type="button"
                                        className={`flex flex-col items-start border rounded-lg px-4 py-3 shadow-sm transition-all font-semibold ${ocupada ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'cursor-pointer'} ${reservaMesaId === mesa.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700'}`}
                                        onClick={!ocupada ? () => {
                                            setReservaMesaId(mesa.id);
                                            setReservaMesaLocal(mesa.local || 'dentro');
                                            setMesaModalOpen(false);
                                        } : undefined}
                                        disabled={ocupada}
                                    >
                                        <span>Mesa {mesa.numero}</span>
                                        <span className="text-xs font-normal text-gray-500">Capacidade: {mesa.capacidade}</span>
                                        <span className="text-xs font-normal text-gray-500">Local: {mesa.local || 'dentro'}</span>
                                        {ocupada && <span className="text-xs text-red-500 mt-1">Mesa ocupada</span>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            </Modal>
                    </div>
                    <hr className="my-4" />
                    <button
                        className="w-full bg-black text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-900 transition-all duration-150"
                        onClick={async () => {
                            setReservaSuccess('');
                            setReservaError('');
                            if (!reservaTelefone || !reservaNome || !reservaHorario || !reservaMesaId) {
                                setReservaError('Preencha todos os campos obrigatórios e selecione uma mesa.');
                                return;
                            }
                            try {
                                const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
                                let clienteId = null;
                                if (usuarioLogado?.id) {
                                    try {
                                        const utils = await import('../../utils');
                                        const cliente = await utils.getClienteByUsuarioId(usuarioLogado.id);
                                        clienteId = cliente?.id;
                                    } catch {
                                        clienteId = null;
                                    }
                                }
                                if (!clienteId) {
                                    setReservaError('Não foi possível identificar o cliente logado.');
                                    return;
                                }
                                const reservaPayload = {
                                    cliente_id: clienteId,
                                    mesa_id: reservaMesaId,
                                    hora: reservaHorario,
                                    status: 'pendente',
                                    observacao: reservaObservacao,
                                    dia: reservaData,
                                    qtd_pessoas: reservaPessoas
                                };
                                const response = await fetch(`${API_BASE_URL}/reserva`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(reservaPayload)
                                });
                                if (!response.ok) {
                                    const errorData = await response.json().catch(() => ({}));
                                    throw new Error(errorData.message || 'Erro ao realizar reserva.');
                                }
                                setReservaSuccess('Reserva realizada com sucesso!');
                                setReservaModalOpen(false);
                            } catch (err) {
                                setReservaError('Erro ao realizar reserva.');
                            }
                        }}
                    >Reservar Agora</button>
                    {reservaSuccess && <div className="text-green-600 mt-4 text-center font-semibold">{reservaSuccess}</div>}
                    {reservaError && <div className="text-red-600 mt-4 text-center font-semibold">{reservaError}</div>}
                </div>
            </Modal>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="flex flex-col gap-6">
                        <LocationCard address={restaurant.address} />
                        <OfficialSitesCard />
                    </div>
                </div>
            </div>
        {/* Modal de Cardápios */}
        <Modal isOpen={menuModalOpen} onClose={() => setMenuModalOpen(false)}>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Cardápios do Restaurante</h2>
                {cardapios.length === 0 ? (
                    <div className="text-gray-500">Nenhum cardápio cadastrado.</div>
                ) : (
                    <ul className="space-y-3">
                        {cardapios.map(cardapio => (
                            <li key={cardapio.id} className="flex items-center justify-between border-b pb-2">
                                <span className="font-semibold">{cardapio.nome}</span>
                                <div className="flex gap-2">
                                    <a
                                        href={`${API_BASE_URL}/cardapio/${cardapio.id}/pdf`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline font-semibold"
                                    >Visualizar</a>
                                    <a
                                        href={`${API_BASE_URL}/cardapio/${cardapio.id}/pdf`}
                                        download
                                        className="text-green-600 underline font-semibold"
                                    >Baixar</a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Modal>
        </>
    );
}

export default RestaurantPage;
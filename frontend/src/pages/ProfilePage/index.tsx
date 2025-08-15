import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewModal from '../../components/ReviewModal';
import { getReservasByCliente, API_BASE_URL, updateCliente, getClienteByUsuarioId } from '../../utils';
export default function ProfilePage() {
    const RESERVAS_POR_PAGINA = 5;
    const [pagina, setPagina] = useState(1);
    // Função para cancelar reserva
    const handleCancelBooking = async (bookingId: number) => {
        try {
            // Buscar dados atuais da reserva
            const resReserva = await fetch(`${API_BASE_URL}/reserva/${bookingId}`);
            if (!resReserva.ok) {
                setErrorMsg('Reserva não encontrada.');
                return;
            }
            const reserva = await resReserva.json();
            // Preencher campos obrigatórios com valores padrão se estiverem ausentes
            const payload = {
                cliente_id: reserva.cliente_id ?? 0,
                mesa_id: reserva.mesa_id ?? 0,
                hora: reserva.hora ?? '00:00',
                dia: reserva.dia ?? new Date().toISOString().slice(0, 10),
                status: 'cancelada', // valor permitido pelo banco
                observacao: reserva.observacao ?? ''
            };
            const response = await fetch(`${API_BASE_URL}/reserva/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setBookingHistory(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelada' } : b));
            } else {
                setErrorMsg('Erro ao cancelar reserva.');
            }
        } catch {
            setErrorMsg('Erro ao cancelar reserva.');
        }
    };
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [bookingHistory, setBookingHistory] = useState<any[]>([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBookingName, setSelectedBookingName] = useState('');
    const [selectedRestauranteId, setSelectedRestauranteId] = useState<number | null>(null);
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
    const [clienteId, setClienteId] = useState<number | null>(null);
    const [selectedBookingHora, setSelectedBookingHora] = useState<string | undefined>(undefined);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        if (usuario) {
            setEmail(usuario.email || '');
            setName(usuario.nome || '');
            setPhone(usuario.telefone || '');
            if (usuario.id) {
                // Buscar o id do cliente pelo id do usuário
                getClienteByUsuarioId(usuario.id)
                    .then(cliente => {
                        if (cliente && cliente.id) setClienteId(cliente.id);
                        if (cliente && cliente.id) {
                            getReservasByCliente(cliente.id)
                                .then(async reservas => {
                                    // Buscar dados do restaurante e mesa para cada reserva
                                    const adaptadas = await Promise.all(reservas.map(async (r: any) => {
                                        // Buscar restaurante
                                        let restauranteNome = 'Restaurante';
                                        let restauranteImg = '/images/bar.jpg';
                                        if (r.restaurante_id) {
                                            try {
                                                const resRest = await fetch(`${API_BASE_URL}/restaurante/${r.restaurante_id}`);
                                                if (resRest.ok) {
                                                    const restData = await resRest.json();
                                                    restauranteNome = restData.nome || restauranteNome;
                                                    restauranteImg = `${API_BASE_URL}/restaurante/${r.restaurante_id}/imagem`;
                                                }
                                            } catch {}
                                        }
                                        // Buscar mesa
                                        let mesaInfo = r.mesa_id ? `Mesa ${r.mesa_id}` : '';
                                        if (r.mesa_id) {
                                            try {
                                                const resMesa = await fetch(`${API_BASE_URL}/mesa/${r.mesa_id}`);
                                                if (resMesa.ok) {
                                                    const mesaData = await resMesa.json();
                                                    mesaInfo = mesaData.numero ? `Mesa ${mesaData.numero}` : mesaInfo;
                                                }
                                            } catch {}
                                        }
                                        // Dia e horário
                                        const dia = r.dia || r.data_reserva || '';
                                        const hora = r.hora || r.hora_reserva || '';
                                        // Verifica se já existe avaliação para esta reserva (considerando restaurante, cliente, dia e hora)
                                        let avaliada = false;
                                        function normalizaHora(hora: string) {
                                            if (!hora) return '';
                                            const partes = hora.split(':');
                                            return `${partes[0]?.padStart(2, '0') || '00'}:${partes[1]?.padStart(2, '0') || '00'}:${partes[2]?.padStart(2, '0') || '00'}`;
                                        }
                                        try {
                                            const resAval = await fetch(`${API_BASE_URL}/avaliacao?cliente_id=${r.cliente_id}&restaurante_id=${r.restaurante_id}&dia=${dia}`);
                                            if (resAval.ok) {
                                                const avaliacoes = await resAval.json();
                                                const horaReserva = normalizaHora(r.hora);
                                                avaliada = Array.isArray(avaliacoes) && avaliacoes.some((a: any) => {
                                                    const horaAvaliacao = normalizaHora(a.hora);
                                                    // Extrai apenas a parte da data (YYYY-MM-DD) da avaliação
                                                    const dataAvaliacao = a.data ? a.data.slice(0, 10) : '';
                                                    // LOG DEBUG
                                                    console.log('Comparando:', {
                                                        reservaId: r.id,
                                                        horaReserva,
                                                        horaAvaliacao,
                                                        dataReserva: dia,
                                                        dataAvaliacao,
                                                        resultado: dataAvaliacao === dia && horaAvaliacao === horaReserva
                                                    });
                                                    return dataAvaliacao === dia && horaAvaliacao === horaReserva;
                                                });
                                            }
                                        } catch {}
                                        return {
                                            id: r.id,
                                            restaurante_id: r.restaurante_id,
                                            restaurant_name: restauranteNome,
                                            image: restauranteImg,
                                            mesa: mesaInfo,
                                            dia,
                                            hora,
                                            people: r.qtd_pessoas ? `${r.qtd_pessoas} Pessoas` : '',
                                            status: r.status,
                                            avaliada
                                        };
                                    }));
                                    // Ordena por data (dia) e hora decrescente
                                    const sorted = [...adaptadas].sort((a, b) => {
                                        // Junta data e hora para comparar
                                        const aDate = new Date(`${a.dia}T${a.hora || '00:00'}`);
                                        const bDate = new Date(`${b.dia}T${b.hora || '00:00'}`);
                                        return bDate.getTime() - aDate.getTime();
                                    });
                                    setBookingHistory(sorted);
                                })
                                .catch(() => setBookingHistory([]));
                        } else {
                            setBookingHistory([]);
                        }
                    })
                    .catch(() => setBookingHistory([]));
            }
        }
    }, []);

    const handleOpenReviewModal = (bookingName: string, bookingId: number) => {
        setSelectedBookingName(bookingName);
        setSelectedBookingId(bookingId);
        // Busca o restauranteId e hora da reserva selecionada
        const reserva = bookingHistory.find(b => b.restaurant_name === bookingName && b.id === bookingId);
        if (reserva && reserva.restaurante_id) setSelectedRestauranteId(reserva.restaurante_id);
        setSelectedBookingHora(reserva?.hora);
        setIsReviewModalOpen(true);
    };

    // Função para atualizar o estado após avaliação
    const handleAvaliacaoFeita = (bookingId: number) => {
        setBookingHistory(prev => prev.map(b => b.id === bookingId ? { ...b, avaliada: true } : b));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
        if (!usuario || !usuario.id) {
            setErrorMsg('Usuário não identificado.');
            return;
        }
        try {
            // Buscar id do cliente pelo id do usuário
            const cliente = await getClienteByUsuarioId(usuario.id);
            if (!cliente || !cliente.id) {
                setErrorMsg('Cliente não encontrado.');
                return;
            }
            const updatedUser = await updateCliente(cliente.id, {
                nome: name,
                email,
                telefone: phone,
                senha: usuario.senha // envia a senha atual
            });
            // Atualiza localStorage e estado
            const novoUsuario = { ...usuario, nome: name, email, telefone: phone };
            localStorage.setItem('usuarioLogado', JSON.stringify(novoUsuario));
            setSuccessMsg('Dados atualizados com sucesso!');
            setName(updatedUser.nome);
            setEmail(updatedUser.email);
            setPhone(updatedUser.telefone);
        } catch (err: any) {
            setErrorMsg('Erro ao atualizar dados.');
        }
    };

    return (
        <>
            <div className="bg-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Coluna do Formulário (não muda) */}
                    <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                        <Link to="/homescreen" className="text-sm font-semibold mb-6 inline-block">&lt; Meu Perfil</Link>
                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                            {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
                            {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
                        </form>
                    </div>

                    {/* Coluna Direita: Histórico de Reservas */}
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">Histórico de Reservas</h2>
                        <div className="space-y-4">
                            {bookingHistory.length === 0 ? (
                                <div className="text-gray-500 text-center py-8">Nenhuma reserva encontrada.</div>
                            ) : (
                                <>
                                    {bookingHistory.slice((pagina-1)*RESERVAS_POR_PAGINA, pagina*RESERVAS_POR_PAGINA).map((booking) => (
                                        <div key={booking.id} className="flex flex-col sm:flex-row items-center border-b pb-4">
                                            <img src={booking.image} alt={booking.restaurant_name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0" />
                                            <div className="ml-4 flex-grow">
                                                <h3 className="font-bold">{booking.restaurant_name}</h3>
                                                <p className="text-sm text-gray-600">Mesa: <span className="font-semibold">{booking.mesa}</span></p>
                                                <p className="text-sm text-gray-600">Dia: <span className="font-semibold">{booking.dia}</span></p>
                                                <p className="text-sm text-gray-600">Horário: <span className="font-semibold">{booking.hora}</span></p>
                                                <p className="text-sm text-gray-600">{booking.people}</p>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-4 sm:mt-0 items-center">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 ${
                                                    booking.status === 'cancelada' ? 'bg-red-100 text-red-600' :
                                                    booking.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={`text-sm font-semibold text-center ${booking.status === 'cancelada' ? 'text-red-600 bg-transparent border-none cursor-not-allowed' : 'text-red-600 hover:underline'}`}
                                                    onClick={() => booking.status !== 'cancelada' && handleCancelBooking(booking.id)}
                                                    disabled={booking.status === 'cancelada'}
                                                >
                                                    {booking.status === 'cancelada' ? 'Cancelada' : 'Cancelar'}
                                                </button>
                                                {/* 3. Botão de Avaliar */}
                                                <button 
                                                    onClick={() => handleOpenReviewModal(booking.restaurant_name, booking.id)}
                                                    className={`text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 ${['cancelada','pendente'].includes((booking.status || '').toLowerCase()) || booking.avaliada ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    disabled={['cancelada','pendente'].includes((booking.status || '').toLowerCase()) || booking.avaliada}
                                                >
                                                    {booking.avaliada ? 'Avaliada' : 'Avaliar'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {/* Paginação */}
                                    {bookingHistory.length > RESERVAS_POR_PAGINA && (
                                        <div className="flex justify-center items-center gap-2 mt-6">
                                            <button
                                                className="px-3 py-1 rounded bg-gray-200 font-semibold"
                                                onClick={() => setPagina(p => Math.max(1, p - 1))}
                                                disabled={pagina === 1}
                                            >Anterior</button>
                                            <span className="font-semibold">Página {pagina} de {Math.ceil(bookingHistory.length / RESERVAS_POR_PAGINA)}</span>
                                            <button
                                                className="px-3 py-1 rounded bg-gray-200 font-semibold"
                                                onClick={() => setPagina(p => Math.min(Math.ceil(bookingHistory.length / RESERVAS_POR_PAGINA), p + 1))}
                                                disabled={pagina === Math.ceil(bookingHistory.length / RESERVAS_POR_PAGINA)}
                                            >Próxima</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. O Modal é renderizado aqui */}
            <ReviewModal 
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                restaurantName={selectedBookingName}
                restauranteId={selectedRestauranteId ?? undefined}
                clienteId={clienteId ?? undefined}
                bookingId={selectedBookingId ?? undefined}
                bookingHora={selectedBookingHora}
                onAvaliacaoFeita={handleAvaliacaoFeita}
            />
        </>
    );
}
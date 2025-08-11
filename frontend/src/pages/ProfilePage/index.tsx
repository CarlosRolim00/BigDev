
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


import { getReservasByCliente } from '../../utils';



export default function ProfilePage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [clienteId, setClienteId] = useState<number|null>(null);
    const [reservas, setReservas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        try {
            const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
            if (usuario) {
                setEmail(usuario.email || '');
                setName(usuario.nome || '');
                setPhone(usuario.telefone || '');
                if (usuario.cliente && usuario.cliente.id) {
                    setClienteId(usuario.cliente.id);
                } else if (usuario.id) {
                    setClienteId(usuario.id);
                }
            }
        } catch {}
    }, []);

    useEffect(() => {
        if (clienteId) {
            setLoading(true);
            getReservasByCliente(clienteId)
                .then(data => setReservas(data))
                .catch(() => setErro('Erro ao buscar reservas'))
                .finally(() => setLoading(false));
        }
    }, [clienteId]);

    return (
        <div className="bg-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Coluna Esquerda: Formulário do Perfil */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow">
                    {/* 1. Link corrigido para /homescreen */}
                    <Link to="/homescreen" className="text-sm font-semibold mb-6 inline-block">&lt; Meu Perfil</Link>
                    
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Telefone</label>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            {/* 2. Botão "Voltar" também corrigido para /homescreen */}
                            <Link to="/homescreen" className="flex-1">
                                <button type="button" className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    Voltar
                                </button>
                            </Link>
                            <button type="submit" className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">
                                Salvar Mudanças
                            </button>
                        </div>
                    </form>
                </div>

                {/* Coluna Direita: Histórico de Reservas */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Histórico de Reservas</h2>
                    {loading && <div>Carregando reservas...</div>}
                    {erro && <div className="text-red-500">{erro}</div>}
                    <div className="space-y-4">
                        {reservas.length === 0 && !loading && !erro && (
                            <div className="text-gray-500">Nenhuma reserva encontrada.</div>
                        )}
                        {reservas.map((reserva, index) => (
                            <div key={index} className="flex items-center border-b pb-4">
                                {/* Imagem placeholder, pois não há imagem na reserva */}
                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                    <span>Reserva</span>
                                </div>
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-bold">Reserva #{reserva.id}</h3>
                                    <p className="text-sm text-gray-600">Mesa: {reserva.mesa_id}</p>
                                    <p className="text-sm font-semibold">Dia: {reserva.dia}</p>
                                    <p className="text-sm font-semibold">Hora: {reserva.hora}</p>
                                    <p className="text-sm font-semibold">Status: {reserva.status}</p>
                                </div>
                                {/* Botão de cancelar pode ser implementado */}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
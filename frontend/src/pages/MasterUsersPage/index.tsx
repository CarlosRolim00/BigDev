import React, { useState, useEffect } from 'react';
import { Trash2, Search } from 'lucide-react';


// Definindo um tipo para os dados do cliente
type User = {
    name: string;
    email: string;
    phone: string;
    status_conta: string;
    id?: number;
    senha?: string;
};


import { getAllClientes, updateCliente } from '../../utils';

// Corrigir tipagem para aceitar status_conta
type UpdateClienteData = {
    nome: string;
    email: string;
    telefone: string;
    senha: string;
    status_conta?: string;
};

export default function MasterUsersPage() {
    // Modal removido
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            setError('');
            try {
                const clientes = await getAllClientes();
                // Mapear para o tipo User
                const mapped = clientes.map((c: any) => {
                    const nomeCliente = c.usuario_nome || (c.usuario && c.usuario.nome) || c.nome || c.nome_completo || c.name || '-';
                    return {
                        id: c.id,
                        name: nomeCliente,
                        email: c.email || '-',
                        phone: c.telefone || c.phone || '-',
                        status_conta: c.status_conta || 'desativado',
                        senha: c.senha || (c.usuario && c.usuario.senha) || ''
                    };
                });
                setUsersData(mapped);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar clientes');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);


    // Função para suspender cliente (status_conta = 'suspenso')
    const handleDelete = async (user: User) => {
        try {
            let clienteId = user.id;
            if (!clienteId && user.email) {
                const cliente = await getAllClientes().then(cs => cs.find((c: any) => c.email === user.email));
                clienteId = cliente?.id;
            }
            if (!clienteId) throw new Error('ID do cliente não encontrado');
            // Buscar cliente atual para obter todos os dados, inclusive senha
            const cliente = await getAllClientes().then(cs => cs.find((c: any) => c.id === clienteId));
            if (!cliente) throw new Error('Cliente não encontrado');
            // Log detalhado das informações do cliente
            console.log('Cliente selecionado para suspender:', cliente);
            // Atualizar apenas os dados existentes, sempre enviando a senha já existente
            if (!cliente.senha || typeof cliente.senha !== 'string' || cliente.senha.trim() === '') {
                alert('Não foi possível suspender: cliente não possui senha cadastrada.');
                return;
            }
            const updateData: UpdateClienteData = {
                nome: cliente.nome || cliente.usuario_nome || cliente.nome_completo || cliente.name || '-',
                email: cliente.email || '-',
                telefone: cliente.telefone || cliente.phone || '-',
                senha: cliente.senha,
                status_conta: 'suspenso'
            };
            console.log('Payload enviado para updateCliente:', updateData);
            await updateCliente(clienteId, updateData);
            // Atualiza lista e marca como suspenso visualmente
            const clientes = await getAllClientes();
            const mapped = clientes.map((c: any) => ({
                id: c.id,
                name: c.usuario_nome || (c.usuario && c.usuario.nome) || c.nome || c.nome_completo || c.name || '-',
                email: c.email || '-',
                phone: c.telefone || c.phone || '-',
                status_conta: c.id === clienteId ? 'suspenso' : (c.status_conta || 'desativado')
            }));
            setUsersData(mapped);
        } catch (err: any) {
            alert(err.message || 'Erro ao suspender cliente');
        }
    };

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
                    <div className="relative w-full md:w-auto">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-6">Carregando clientes...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={5} className="text-center text-red-500 py-6">{error}</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center text-gray-500 py-6">Nenhum cliente encontrado.</td></tr>
                            ) : filteredUsers.map((user, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{user.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{user.phone}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status_conta === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status_conta === 'ativo' ? 'Ativo' : 'Desativado'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* 3. Botão de editar agora abre o modal com os dados */}
                                            <button onClick={() => handleDelete(user)} className="text-gray-600 hover:text-red-600" title="Suspender Usuário">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </>
    );
}
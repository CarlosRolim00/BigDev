// Utilitário para formatar CNPJ no padrão XX.XXX.XXX/XXXX-XX
function formatCNPJ(cnpj?: string | null): string {
    if (!cnpj) return '-';
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) return cnpj;
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
import { useState, useEffect } from 'react';
import { Trash2, Search, PlusCircle } from 'lucide-react';
import Modal from '../../components/Modal';

// 1. Definindo um tipo para os dados do restaurante (com o novo campo)
type Restaurant = {
    id: number | string;
    name: string;
    cnpj: string;
    email?: string;
    status: 'Ativo' | 'Pendente' | 'Suspenso';
    registered_at: string;
    address: string;
    type: string;
    phone: string;
};


import { getAllRestaurantes, registerRestauranteComGerente, updateRestaurante, getRestauranteById } from '../../utils';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo': return 'bg-green-100 text-green-700';
        case 'Pendente': return 'bg-yellow-100 text-yellow-700';
        case 'Suspenso': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function MasterRestaurantsPage() {
    // ...existing code...
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        tipoCozinha: '',
        email: '',
        senha: '',
        status: 'Pendente',
    });
    const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function fetchRestaurants() {
            setLoading(true);
            setError('');
            try {
                const restaurantes = await getAllRestaurantes();
                // Mapear para o tipo Restaurant
                const mapped = restaurantes.map((r: any) => ({
                    id: r.id || r._id || r.restaurante_id || r.restauranteId,
                    name: r.nome || r.name || '-',
                    cnpj: r.cnpj || '-',
                    status: r.status || 'Pendente',
                    registered_at: r.data_cadastro ? new Date(r.data_cadastro).toLocaleDateString('pt-BR') : (r.registered_at || '-'),
                    address: r.endereco || r.address || '-',
                    type: r.tipo_cozinha || r.tipoCozinha || r.type || '-',
                    phone: r.telefone || r.phone || '-'
                }));
                setRestaurantsData(mapped);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar restaurantes');
            } finally {
                setLoading(false);
            }
        }
        fetchRestaurants();
    }, []);


    // Função para suspender (desativar) restaurante usando a mesma lógica do dashboard
    const handleDelete = async (resto: Restaurant) => {
        try {
            // Buscar restaurante completo pelo id (igual dashboard)
            const id = (resto as any).id || (resto as any)._id || (resto as any).restaurante_id || (resto as any).restauranteId;
            if (!id) {
                alert('ID do restaurante não encontrado.');
                return;
            }
            const restaurante = await getRestauranteById(id);
            await updateRestaurante(
                id,
                {
                    nome: restaurante.nome,
                    cnpj: restaurante.cnpj,
                    endereco: restaurante.endereco,
                    telefone: restaurante.telefone,
                    tipo_cozinha: restaurante.tipo_cozinha,
                    status: 'Suspenso'
                }
            );
            // Atualiza lista
            const restaurantes = await getAllRestaurantes();
            const mapped = restaurantes.map((r: any) => ({
                id: r.id || r._id || r.restaurante_id || r.restauranteId,
                name: r.nome || r.name || '-',
                cnpj: r.cnpj || '-',
                status: r.status || 'Pendente',
                registered_at: r.data_cadastro ? new Date(r.data_cadastro).toLocaleDateString('pt-BR') : (r.registered_at || '-'),
                address: r.endereco || r.address || '-',
                type: r.tipo_cozinha || r.tipoCozinha || r.type || '-',
                phone: r.telefone || r.phone || '-'
            }));
            setRestaurantsData(mapped);
        } catch (err: any) {
            alert(err.message || 'Erro ao desativar restaurante');
        }
    };

    const filteredRestaurants = restaurantsData.filter(resto =>
        resto.name.toLowerCase().includes(search.toLowerCase()) ||
        resto.cnpj.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Gerenciar Restaurantes</h2>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CNPJ..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold whitespace-nowrap"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <PlusCircle size={20} />
                            Adicionar
                        </button>
            {/* Modal de cadastro de restaurante */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Cadastrar Restaurante</h2>
                    <form className="space-y-4" onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                            await registerRestauranteComGerente(
                                addForm.nome,
                                addForm.cnpj,
                                addForm.endereco,
                                addForm.telefone,
                                addForm.tipoCozinha,
                                addForm.email,
                                addForm.senha
                            );
                            setIsAddModalOpen(false);
                            setAddForm({ nome: '', cnpj: '', endereco: '', telefone: '', tipoCozinha: '', email: '', senha: '', status: 'Pendente' });
                            // Atualiza lista
                            const restaurantes = await getAllRestaurantes();
                            const mapped = restaurantes.map((r: any) => ({
                                name: r.nome || r.name || '-',
                                cnpj: r.cnpj || '-',
                                status: r.status || 'Pendente',
                                registered_at: r.data_cadastro ? new Date(r.data_cadastro).toLocaleDateString('pt-BR') : (r.registered_at || '-'),
                                address: r.endereco || r.address || '-',
                                type: r.tipo_cozinha || r.tipoCozinha || r.type || '-',
                                phone: r.telefone || r.phone || '-'
                            }));
                            setRestaurantsData(mapped);
                        } catch (err: any) {
                            alert(err.message || 'Erro ao cadastrar restaurante');
                        }
                    }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 font-medium">Nome do Restaurante</label>
                                <input
                                    type="text"
                                    placeholder="Nome do seu estabelecimento"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={addForm.nome}
                                    onChange={e => setAddForm(f => ({ ...f, nome: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">CNPJ</label>
                                <input
                                    type="text"
                                    placeholder="00.000.000/0000-00"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={addForm.cnpj}
                                    onChange={e => setAddForm(f => ({ ...f, cnpj: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-medium">Endereço</label>
                            <input
                                type="text"
                                placeholder="Rua, Número, Bairro, Cidade - Estado"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={addForm.endereco}
                                onChange={e => setAddForm(f => ({ ...f, endereco: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 font-medium">Telefone</label>
                                <input
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={addForm.telefone}
                                    onChange={e => setAddForm(f => ({ ...f, telefone: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-medium">Tipo de Cozinha</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Italiana, Japonesa, Brasileira"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                    value={addForm.tipoCozinha}
                                    onChange={e => setAddForm(f => ({ ...f, tipoCozinha: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-medium">Email de Contato</label>
                            <input
                                type="email"
                                placeholder="contato@restaurante.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={addForm.email}
                                onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-medium">Crie uma Senha</label>
                            <input
                                type="password"
                                placeholder="********"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                value={addForm.senha}
                                onChange={e => setAddForm(f => ({ ...f, senha: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </Modal>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                                {/* Email removido */}
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Tipo Cozinha</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Endereço</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-6">Carregando restaurantes...</td></tr>
                            ) : error ? (
                                <tr><td colSpan={7} className="text-center text-red-500 py-6">{error}</td></tr>
                            ) : filteredRestaurants.length === 0 ? (
                                <tr><td colSpan={7} className="text-center text-gray-500 py-6">Nenhum restaurante encontrado.</td></tr>
                            ) : filteredRestaurants.map((resto, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{resto.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{formatCNPJ(resto.cnpj)}</td>
                                    {/* Email removido */}
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{resto.type}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{resto.address}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(resto.status)}`}
                                            style={{
                                                backgroundColor:
                                                    resto.status.toLowerCase() === 'ativo' ? '#D1FAE5' :
                                                    resto.status.toLowerCase() === 'pendente' ? '#FEF3C7' :
                                                    resto.status.toLowerCase() === 'suspenso' ? '#FECACA' : '#F3F4F6',
                                                color:
                                                    resto.status.toLowerCase() === 'ativo' ? '#047857' :
                                                    resto.status.toLowerCase() === 'pendente' ? '#B45309' :
                                                    resto.status.toLowerCase() === 'suspenso' ? '#B91C1C' : '#374151',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {resto.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDelete(resto)} className="text-gray-600 hover:text-red-600" title="Desativar restaurante"><Trash2 size={18} /></button>
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
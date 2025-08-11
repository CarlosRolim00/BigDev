import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/Modal';
import { Link } from 'react-router-dom';
import { getRestauranteById, updateRestaurante, getTablesByRestaurante } from '../../utils';
import { addTable, deleteTable } from '../../utils';



export default function AdminSettingsPage() {

    // Estado para controlar se o modal de mesas está aberto
    const [isTableModalOpen, setIsTableModalOpen] = useState(false);
    // Estado para controlar a "tela" dentro do modal
    const [modalView, setModalView] = useState<'list' | 'add'>('list');

    // Estado para dados do restaurante
    const [form, setForm] = useState({
        nome: '',
        tipo_cozinha: '',
        endereco: '',
        cnpj: '',
        telefone: ''
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Mesas do restaurante
    const [tables, setTables] = useState<any[]>([]);
    const [loadingTables, setLoadingTables] = useState(false);
    const [tableError, setTableError] = useState('');
    const [addTableForm, setAddTableForm] = useState({ numero: '', capacidade: '', localizacao: 'dentro' });
    const [addTableLoading, setAddTableLoading] = useState(false);
    const [addTableError, setAddTableError] = useState('');
    const [deleteTableSuccess, setDeleteTableSuccess] = useState('');

    // Buscar mesas do restaurante ao abrir o modal
    const fetchTables = async () => {
        setLoadingTables(true);
        try {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            const data = await getTablesByRestaurante(restaurante_id);
            setTables(data);
            setTableError('');
        } catch (err: any) {
            setTables([]);
            setTableError('Erro ao buscar mesas.');
        } finally {
            setLoadingTables(false);
        }
    };

    // Handler para abrir modal e buscar mesas
    const handleOpenTableModal = () => {
        setTableError('');
        setModalView('list');
        setIsTableModalOpen(true);
        fetchTables();
    };

    // Handler para adicionar mesa
    const handleAddTableSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddTableLoading(true);
        setAddTableError('');
        setTableError('');
        try {
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            await addTable(restaurante_id, addTableForm.numero, addTableForm.capacidade, addTableForm.localizacao);
            setAddTableForm({ numero: '', capacidade: '', localizacao: 'dentro' });
            setTableError('');
            setModalView('list');
            fetchTables();
        } catch (err: any) {
            setAddTableError('Erro ao adicionar mesa.');
        } finally {
            setAddTableLoading(false);
        }
    };

    // Handler para remover mesa
    const handleDeleteTable = async (tableId: number) => {
        setTableError('');
        try {
            await deleteTable(tableId);
            setDeleteTableSuccess('Mesa removida com sucesso!');
            setModalView('list');
            fetchTables();
            setTimeout(() => setDeleteTableSuccess(''), 2000);
        } catch (err: any) {
            if (err.message && err.message.includes('reserva_mesa_id_fkey')) {
                setTableError('Não é possível remover a mesa: existem reservas vinculadas a ela.');
            } else {
                setTableError('Erro ao remover mesa.');
            }
        }
    };

    // Buscar dados do restaurante ao carregar
    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) {
            setError('Restaurante não identificado.');
            setLoading(false);
            return;
        }
        getRestauranteById(restaurante_id)
            .then(data => {
                setForm({
                    nome: data.nome || '',
                    tipo_cozinha: data.tipo_cozinha || '',
                    endereco: data.endereco || '',
                    cnpj: data.cnpj || '',
                    telefone: data.telefone || ''
                });
                setLoading(false);
            })
            .catch(() => {
                setError('Erro ao buscar dados do restaurante.');
                setLoading(false);
            });
    }, []);

    // Handler para alteração dos campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handler para submit do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess('');
        setError('');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        try {
            await updateRestaurante(restaurante_id, form);
            setSuccess('Alterações salvas com sucesso!');
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar alterações.');
        }
    };

    return (
        <>
            <div className="space-y-8">
                {/* Seção de Informações da Loja */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Informações da Loja</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {loading ? (
                            <div>Carregando dados...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Nome do Restaurante</label>
                                        <input type="text" name="nome" value={form.nome} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Tipo de Cozinha</label>
                                        <input type="text" name="tipo_cozinha" value={form.tipo_cozinha} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Endereço</label>
                                    <input type="text" name="endereco" value={form.endereco} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">CNPJ</label>
                                        <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">Telefone</label>
                                        <input type="text" name="telefone" value={form.telefone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <button 
                                        type="button" 
                                        onClick={handleOpenTableModal}
                                        className="font-semibold text-blue-600 hover:underline"
                                    >
                                        Gerenciar Mesas
                                    </button>
                                    <button type="submit" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
                                        <Save size={18} />
                                        Salvar Alterações
                                    </button>
                                </div>
                                {success && <div className="text-green-600 mt-2">{success}</div>}
                                {error && <div className="text-red-600 mt-2">{error}</div>}
                            </>
                        )}
                    </form>
                </div>

                {/* Seção de Horário de Funcionamento */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Horário de Funcionamento</h2>
                    <div className="space-y-3">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                            <div key={day} className="grid grid-cols-3 items-center gap-4">
                                <span className="font-medium">{day}</span>
                                <div className="flex items-center gap-2">
                                    <input type="time" defaultValue="11:30" className="w-full p-2 border rounded-md" />
                                    <span>até</span>
                                    <input type="time" defaultValue="23:00" className="w-full p-2 border rounded-md" />
                                </div>
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" /> Fechado
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="text-right mt-4">
                        <button type="submit" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
                        <Save size={18} />
                        Salvar Horários
                        </button>
                    </div>
                </div>

                {/* Seção de Gerenciamento do Cardápio */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Gerenciamento do Cardápio</h2>
                    <p className="text-gray-600 mb-4">Adicione, edite ou remova itens do seu cardápio.</p>
                    {/* 2. Botão agora é um Link */}
                    <Link to="/admin/menu" className="font-semibold text-blue-600 hover:underline">
                        Ir para a página de Cardápio
                    </Link>
                </div>
            </div>

            {/* Modal ÚNICO para Gerenciar e Adicionar Mesas */}
            <Modal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)}>
                {modalView === 'list' ? (
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Gerenciar Mesas</h2>
                        {loadingTables ? (
                            <div>Carregando mesas...</div>
                        ) : (
                            <>
                                {tableError && <div className="text-red-600">{tableError}</div>}
                                {deleteTableSuccess && <div className="text-green-600 mb-2">{deleteTableSuccess}</div>}
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {tables.length === 0 ? (
                                        <div className="text-gray-500">Nenhuma mesa cadastrada.</div>
                                    ) : (
                                        tables.map(table => (
                                            <div key={table.id} className="flex items-center justify-between border p-3 rounded-md">
                                                <div>
                                                    <p className="font-semibold">Mesa {table.numero}</p>
                                                    <p className="text-sm text-gray-500">{table.capacidade} lugares - {table.localizacao}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {/* <button className="p-2 text-gray-600 hover:text-black"><Edit size={18} /></button> */}
                                                    <button className="p-2 text-gray-600 hover:text-red-600" onClick={() => handleDeleteTable(table.id)}><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                        <div className="border-t mt-4 pt-4 space-y-4">
                            <button onClick={() => { setTableError(''); setModalView('add'); }} className="flex items-center gap-2 text-blue-600 font-semibold">
                                <PlusCircle size={20} />
                                Adicionar Mesa
                            </button>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsTableModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Voltar</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold mb-6">Adicionar Nova Mesa</h2>
                        <form className="space-y-4" onSubmit={handleAddTableSubmit}>
                            <div>
                                <label className="block text-sm font-medium">Número da Mesa</label>
                                <input type="number" name="numero" value={addTableForm.numero} onChange={e => setAddTableForm(f => ({ ...f, numero: e.target.value }))} placeholder="Ex: 15" className="w-full mt-1 p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Número de Pessoas</label>
                                <input type="number" name="capacidade" value={addTableForm.capacidade} onChange={e => setAddTableForm(f => ({ ...f, capacidade: e.target.value }))} placeholder="Ex: 4" className="w-full mt-1 p-2 border rounded-md" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Localização</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="localizacao" value="dentro" checked={addTableForm.localizacao === 'dentro'} onChange={e => setAddTableForm(f => ({ ...f, localizacao: e.target.value }))} /> Dentro
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="localizacao" value="fora" checked={addTableForm.localizacao === 'fora'} onChange={e => setAddTableForm(f => ({ ...f, localizacao: e.target.value }))} /> Fora
                                    </label>
                                </div>
                            </div>
                            {addTableError && <div className="text-red-600">{addTableError}</div>}
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setModalView('list')} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold" disabled={addTableLoading}>{addTableLoading ? 'Adicionando...' : 'Adicionar Mesa'}</button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </>
    );
}
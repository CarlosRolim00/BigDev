import React, { useState, useEffect } from 'react';
import { Save, PlusCircle, Trash2, Edit } from 'lucide-react';
import Modal from '../../components/Modal';
import { Link } from 'react-router-dom';
import { getRestauranteById, updateRestaurante, getTablesByRestaurante, uploadRestauranteImage } from '../../utils';

import { addTable, deleteTable } from '../../utils';



export default function AdminSettingsPage() {
    // Estado para modal de horários disponíveis
    const [isHorariosModalOpen, setIsHorariosModalOpen] = useState(false);
    // Gera horários entre abertura e fechamento (intervalo de 30min)
    function gerarHorariosPossiveis(abertura: string, fechamento: string) {
        const horarios: string[] = [];
        if (!abertura || !fechamento) return horarios;
        const [hIni, mIni] = abertura.split(":").map(Number);
        const [hFim, mFim] = fechamento.split(":").map(Number);
        let totalIni = hIni * 60 + mIni;
        let totalFim = hFim * 60 + mFim - 1; // 1 minuto antes do fechamento
        for (let min = totalIni; min <= totalFim; min += 30) {
            const h = Math.floor(min / 60);
            const m = min % 60;
            horarios.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
        return horarios;
    }
    // Estado para horário manual
    const [horarioManual, setHorarioManual] = useState('');
    // Handler para salvar dados gerais do restaurante
    const handleSaveInfo = async () => {
        setSuccessInfo('');
        setErrorInfo('');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/restaurante/${restaurante_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!response.ok) throw new Error('Erro ao salvar alterações');
            setSuccessInfo('Informações salvas com sucesso!');
        } catch (err: any) {
            setErrorInfo(err.message || 'Erro ao salvar informações.');
        }
    };
        // Estado para upload de imagem
    const [image, setImage] = useState<File | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    // Buscar dados do restaurante ao carregar (inclui imagem)
    useEffect(() => {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        if (!restaurante_id) return;
        getRestauranteById(restaurante_id)
            .then(data => {
                setForm({
                    nome: data.nome || '',
                    tipo_cozinha: data.tipo_cozinha || '',
                    endereco: data.endereco || '',
                    cnpj: data.cnpj || '',
                    telefone: data.telefone || '',
                    horario_abertura: data.horario_abertura ?? '11:30',
                    horario_fechamento: data.horario_fechamento ?? '23:00'
                });
                setImageUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/restaurante/${restaurante_id}/imagem?v=${Date.now()}`);
            })
            .catch(() => {
                setImageUrl('');
            });
    }, []);

    // Handler para upload de imagem
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!image) return;
        setImageUploading(true);
        setImageUploadError('');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        try {
            await uploadRestauranteImage(restaurante_id, image, form);
            // Buscar novamente os dados do restaurante para atualizar a imagem
            await getRestauranteById(restaurante_id);
            setImageUrl(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/restaurante/${restaurante_id}/imagem?v=${Date.now()}`);
            setImage(null);
        } catch (err: any) {
            setImageUploadError('Erro ao fazer upload da imagem.');
        } finally {
            setImageUploading(false);
        }
    };
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
        telefone: '',
        horario_abertura: '11:30',
        horario_fechamento: '23:00'
    });
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
    const [horariosInput, setHorariosInput] = useState('');
    const [horariosSuccess, setHorariosSuccess] = useState('');
    const [horariosError, setHorariosError] = useState('');
    const [loading, setLoading] = useState(true);
    const [successInfo, setSuccessInfo] = useState('');
    const [errorInfo, setErrorInfo] = useState('');
    const [successHorario, setSuccessHorario] = useState('');
    const [errorHorario, setErrorHorario] = useState('');

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
            setErrorInfo('Restaurante não identificado.');
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
                    telefone: data.telefone || '',
                    horario_abertura: data.horario_abertura ?? '11:30',
                    horario_fechamento: data.horario_fechamento ?? '23:00'
                });
                setHorariosDisponiveis(Array.isArray(data.horarios_disponiveis) ? data.horarios_disponiveis : []);
                setHorariosInput((Array.isArray(data.horarios_disponiveis) ? data.horarios_disponiveis : []).join(", "));
                setLoading(false);
            })
            .catch(() => {
                setErrorInfo('Erro ao buscar dados do restaurante.');
                setLoading(false);
            });
    }, []);

    // Handler para alteração dos campos
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value || ''
        }));
    };

    // Handler para submit do formulário (salvar horários de funcionamento)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    setSuccessHorario('');
    setErrorHorario('');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        try {
            // Atualiza horários de funcionamento no backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/restaurante/${restaurante_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form
                })
            });
            if (!response.ok) throw new Error('Erro ao salvar horários de funcionamento');
            setSuccessHorario('Horários de funcionamento salvos com sucesso!');
        } catch (err: any) {
            setErrorHorario(err.message || 'Erro ao salvar horários de funcionamento.');
        }
    };

    // Handler para salvar horários disponíveis
    const handleSaveHorarios = async () => {
        setHorariosSuccess('');
        setHorariosError('');
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        // Usa os horários selecionados
        const horarios = horariosDisponiveis;
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/restaurante/${restaurante_id}/horarios`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ horarios })
            });
            if (!response.ok) throw new Error('Erro ao salvar horários');
            setHorariosSuccess('Horários salvos com sucesso!');
        } catch (err: any) {
            setHorariosError('Erro ao salvar horários.');
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
                                <div className="flex flex-wrap gap-4 justify-between items-center pt-2">
                                    <div className="flex gap-2 items-center">
                                        <button 
                                            type="button" 
                                            onClick={handleOpenTableModal}
                                            className="font-semibold text-blue-600 hover:underline"
                                        >
                                            Gerenciar Mesas
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <input type="file" accept="image/*" id="restaurante-image-upload" style={{ display: 'none' }} onChange={handleImageChange} />
                                            <button
                                                type="button"
                                                className="font-semibold text-blue-600 hover:underline"
                                                onClick={() => document.getElementById('restaurante-image-upload')?.click()}
                                            >
                                                {image ? 'Selecionado: ' + image.name : 'Adicionar/Alterar Foto'}
                                            </button>
                                            {image && (
                                                <button
                                                    type="button"
                                                    className="bg-green-600 text-white px-2 py-1 rounded"
                                                    onClick={handleImageUpload}
                                                    disabled={imageUploading}
                                                >
                                                    {imageUploading ? 'Enviando...' : 'Enviar'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleSaveInfo} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
                                        <Save size={18} />
                                        Salvar Alterações
                                    </button>
                                </div>
                                {imageUrl && (
                                                                        <div className="mt-2">
                                                                                <img src={imageUrl} alt="Foto do restaurante" className="max-h-32 rounded shadow" />
                                                                                {(successInfo || errorInfo) && (
                                                                                    <div className="mt-2">
                                                                                        {successInfo && <div className="text-green-600">{successInfo}</div>}
                                                                                        {errorInfo && <div className="text-red-600">{errorInfo}</div>}
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                )}
                                {imageUploadError && <div className="text-red-600 mt-2">{imageUploadError}</div>}
                                {/* Notificações de sucesso/erro do botão de imagem e dados */}
                            </>
                        )}
                    </form>
                </div>

                {/* Seção de Horário de Funcionamento */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Horário de Funcionamento</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                                                                        <div className="flex gap-4 items-center">
                                                                                <label className="block text-sm font-medium">Abertura</label>
                                                                                <input
                                                                                    type="time"
                                                                                    name="horario_abertura"
                                                                                    value={form.horario_abertura || ''}
                                                                                    onChange={handleChange}
                                                                                    className="p-2 border rounded-md"
                                                                                />
                                                                                <label className="block text-sm font-medium">Fechamento</label>
                                                                                <input
                                                                                    type="time"
                                                                                    name="horario_fechamento"
                                                                                    value={form.horario_fechamento || ''}
                                                                                    onChange={handleChange}
                                                                                    className="p-2 border rounded-md"
                                                                                />
                                                                                <button type="submit" className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
                                                                                        <Save size={18} />
                                                                                        Salvar Horários de Funcionamento
                                                                                </button>
                                                                        </div>
                                                                        {(successHorario || errorHorario) && (
                                                                            <div className="mt-2">
                                                                                {successHorario && <div className="text-green-600">{successHorario}</div>}
                                                                                {errorHorario && <div className="text-red-600">{errorHorario}</div>}
                                                                            </div>
                                                                        )}
                    </form>
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Horários Disponíveis para Reserva</h3>
                        <button type="button" onClick={() => setIsHorariosModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">
                            <Save size={18} />
                            Editar Horários Disponíveis
                        </button>
                        <div className="mt-2 text-sm text-gray-600">Horários atuais: {horariosDisponiveis.join(", ") || 'Nenhum cadastrado.'}</div>
                        <Modal isOpen={isHorariosModalOpen} onClose={() => setIsHorariosModalOpen(false)}>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-4">Selecionar Horários Disponíveis</h2>
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {gerarHorariosPossiveis(form.horario_abertura, form.horario_fechamento).map(horario => (
                                        <button
                                            key={horario}
                                            type="button"
                                            className={`px-3 py-1 rounded border font-mono ${horariosDisponiveis.includes(horario) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-black border-gray-300'} transition`}
                                            onClick={() => {
                                                if (horariosDisponiveis.includes(horario)) {
                                                    setHorariosDisponiveis(prev => prev.filter(h => h !== horario));
                                                } else {
                                                    setHorariosDisponiveis(prev => [...prev, horario]);
                                                }
                                            }}
                                        >
                                            {horario}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 items-center mb-2">
                                    <input
                                        type="time"
                                        value={horarioManual}
                                        onChange={e => setHorarioManual(e.target.value)}
                                        className="p-2 border rounded-md"
                                        placeholder="Adicionar horário manual"
                                    />
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                        onClick={() => {
                                            if (horarioManual && !horariosDisponiveis.includes(horarioManual)) {
                                                setHorariosDisponiveis(prev => [...prev, horarioManual]);
                                                setHorarioManual('');
                                            }
                                        }}
                                    >Adicionar horário</button>
                                </div>
                                <button type="button" onClick={() => { handleSaveHorarios(); setIsHorariosModalOpen(false); }} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
                                    <Save size={18} />
                                    Salvar Horários Disponíveis
                                </button>
                                {horariosSuccess && <div className="text-green-600 mt-2">{horariosSuccess}</div>}
                                {horariosError && <div className="text-red-600 mt-2">{horariosError}</div>}
                            </div>
                        </Modal>
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
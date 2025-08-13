import React, { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import Modal from '../../components/Modal'; // 1. Importe o Modal

// Definindo um tipo para os dados do cliente
type User = {
    name: string;
    email: string;
    phone: string;
    registered_at: string;
};

// Dados mocados para os clientes
const usersData: User[] = [
    { name: 'Jhonatan G.', email: 'jhonatan.g@email.com', phone: '(11) 91234-5678', registered_at: '2025-08-10' },
    { name: 'Maria Souza', email: 'maria.s@email.com', phone: '(21) 98765-4321', registered_at: '2025-08-09' },
    { name: 'Carlos Pereira', email: 'carlos.p@email.com', phone: '(31) 91122-3344', registered_at: '2025-08-08' },
];

export default function MasterUsersPage() {
    // 2. Estados para controlar o modal e os dados do cliente em edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Função para abrir o modal com os dados do cliente selecionado
    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Cliente ${editingUser?.name} atualizado!`);
        setIsEditModalOpen(false);
    };

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
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Data de Cadastro</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {usersData.map((user, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{user.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{user.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{user.phone}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{user.registered_at}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* 3. Botão de editar agora abre o modal com os dados */}
                                            <button onClick={() => handleEditClick(user)} className="text-gray-600 hover:text-blue-600" title="Editar Cliente">
                                                <Edit size={18} />
                                            </button>
                                            <button className="text-gray-600 hover:text-red-600" title="Suspender Usuário">
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

            {/* 4. Modal para Editar Cliente */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Editar Cliente</h2>
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Nome Completo</label>
                            <input type="text" defaultValue={editingUser?.name} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" defaultValue={editingUser?.email} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Telefone</label>
                            <input type="tel" defaultValue={editingUser?.phone} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                             <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
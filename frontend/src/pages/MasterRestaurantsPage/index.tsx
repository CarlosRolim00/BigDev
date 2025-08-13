import React, { useState } from 'react';
import { Edit, Trash2, Search, PlusCircle } from 'lucide-react';
import Modal from '../../components/Modal';

// 1. Definindo um tipo para os dados do restaurante (com o novo campo)
type Restaurant = {
    name: string;
    cnpj: string;
    email: string;
    status: 'Ativo' | 'Pendente' | 'Suspenso';
    registered_at: string;
    address: string;
    type: string;
    phone: string; // Adicionado telefone
};

// 2. Dados mocados atualizados
const restaurantsData: Restaurant[] = [
    { name: 'PollGreen Irish Pub', cnpj: '12.345.678/0001-99', email: 'contato@pollgreen.com', status: 'Ativo', registered_at: '2025-07-20', address: 'R. Domingos Olímpio, 219 - Centro, Sobral - CE', type: 'Irlandesa, Pub', phone: '(88) 91234-5678' },
    { name: 'Blu Méditerranée', cnpj: '98.765.432/0001-11', email: 'falecom@blu.com', status: 'Ativo', registered_at: '2025-06-15', address: 'R. Dr. Monte, 535 - Centro, Sobral - CE', type: 'Mediterrânea', phone: '(88) 98765-4321' },
    { name: 'Cantina da Serra', cnpj: '55.666.777/0001-22', email: 'suporte@cantina.com', status: 'Pendente', registered_at: '2025-08-10', address: 'Av. Dom José, 100 - Centro, Sobral - CE', type: 'Italiana', phone: '(88) 91122-3344' },
    { name: 'Sushi Express', cnpj: '33.444.555/0001-33', email: 'contato@sushiexpress.com', status: 'Suspenso', registered_at: '2025-05-01', address: 'R. Cel. José Silvestre, 200 - Centro, Sobral - CE', type: 'Japonesa', phone: '(88) 95566-7788' },
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Ativo': return 'bg-green-100 text-green-700';
        case 'Pendente': return 'bg-yellow-100 text-yellow-700';
        case 'Suspenso': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function MasterRestaurantsPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

    const handleEditClick = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert(`Restaurante ${editingRestaurant?.name} atualizado!`);
        setIsEditModalOpen(false);
    };

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
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold whitespace-nowrap">
                            <PlusCircle size={20} />
                            Adicionar
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">CNPJ</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {restaurantsData.map((resto, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap font-medium">{resto.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{resto.cnpj}</td>
                                    <td className="py-4 px-4 whitespace-nowrap text-gray-600">{resto.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(resto.status)}`}>
                                            {resto.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditClick(resto)} className="text-gray-600 hover:text-blue-600"><Edit size={18} /></button>
                                            <button className="text-gray-600 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">Editar Restaurante</h2>
                    {/* 3. Formulário atualizado com o campo de telefone */}
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Nome do Restaurante</label>
                                <input type="text" defaultValue={editingRestaurant?.name} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo de Cozinha</label>
                                <input type="text" defaultValue={editingRestaurant?.type} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Endereço</label>
                            <input type="text" defaultValue={editingRestaurant?.address} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium">CNPJ</label>
                                <input type="text" defaultValue={editingRestaurant?.cnpj} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Telefone</label>
                                <input type="tel" defaultValue={editingRestaurant?.phone} className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" defaultValue={editingRestaurant?.email} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Status</label>
                            <select defaultValue={editingRestaurant?.status} className="w-full mt-1 p-2 border rounded-md bg-white">
                                <option>Ativo</option>
                                <option>Pendente</option>
                                <option>Suspenso</option>
                            </select>
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
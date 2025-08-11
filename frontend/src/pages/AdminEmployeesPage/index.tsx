import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';

// Definindo um tipo para o funcionário
type Employee = {
    name: string;
    role: string;
    email: string;
    phone: string;
    cpf: string; // Adicionado CPF ao tipo
};

// Dados mocados para os funcionários
const employeesData: Employee[] = [
    { name: 'Ana Silva', role: 'Gerente', email: 'ana.silva@email.com', phone: '(88) 91234-5678', cpf: '123.456.789-00' },
    { name: 'Carlos Souza', role: 'Garçom', email: 'carlos.souza@email.com', phone: '(88) 98765-4321', cpf: '111.222.333-44' },
    { name: 'Beatriz Lima', role: 'Cozinheira', email: 'beatriz.lima@email.com', phone: '(88) 91122-3344', cpf: '555.666.777-88' },
];

export default function AdminEmployeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const handleAddNewEmployee = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingEmployee) {
            alert(`Funcionário ${editingEmployee.name} atualizado!`);
        } else {
            alert('Novo funcionário adicionado!');
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Funcionários</h2>
                    <button
                        onClick={handleAddNewEmployee}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold"
                    >
                        <PlusCircle size={20} />
                        Adicionar Funcionário
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employeesData.map((employee, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.role}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.phone}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditEmployee(employee)} className="text-gray-600 hover:text-blue-600"><Edit size={18} /></button>
                                            <button className="text-gray-600 hover:text-red-600"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-6">{editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}</h2>
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Nome Completo</label>
                            <input type="text" placeholder="Nome do funcionário" defaultValue={editingEmployee?.name} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cargo</label>
                            <input type="text" placeholder="Ex: Garçom" defaultValue={editingEmployee?.role} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">CPF</label>
                            <input type="text" placeholder="000.000.000-00" defaultValue={editingEmployee?.cpf} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input type="email" placeholder="email@exemplo.com" defaultValue={editingEmployee?.email} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Telefone</label>
                            <input type="tel" placeholder="(00) 00000-0000" defaultValue={editingEmployee?.phone} className="w-full mt-1 p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Senha</label>
                            <input
                                type="password"
                                placeholder={editingEmployee ? "Deixe em branco para não alterar" : "********"}
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md font-semibold">Cancelar</button>
                             <button type="submit" className="px-4 py-2 bg-black text-white rounded-md font-semibold">Salvar</button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
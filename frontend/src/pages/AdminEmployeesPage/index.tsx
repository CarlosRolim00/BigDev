import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { getFuncionarios, createFuncionario, updateFuncionario, deleteFuncionario } from '../../utils';

// Definindo um tipo para o funcionário
type Employee = {
    id: number;
    name: string;
    role: string;
    email: string;
    phone: string;
    cpf: string; // Adicionado CPF ao tipo
};

export default function AdminEmployeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [emailValue, setEmailValue] = useState<string>("");   

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
                const restaurante_id = usuarioLogado.restaurante_id;
                const data = await getFuncionarios(restaurante_id);
                // Mapear os campos do backend para os nomes esperados pelo frontend
                const mapped = data.map((f: any) => ({
                    id: f.id,
                    name: f.nome,
                    role: f.cargo,
                    cpf: f.cpf,
                    email: f.email,
                    phone: f.telefone
                }));
                setEmployees(mapped);
            } catch (err) {
                // Trate o erro conforme necessário
            }
        }
        fetchEmployees();
    }, []);

    const handleAddNewEmployee = () => {
    setEditingEmployee(null);
    setEmailValue("");
    setIsModalOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setEmailValue(employee.email);
    setIsModalOpen(true);
    };

    const handleDeleteEmployee = async (employee: Employee) => {
        if (window.confirm('Tem certeza que deseja remover este funcionário?')) {
            await deleteFuncionario(employee.id);
            // Atualiza a lista após deletar
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
            const restaurante_id = usuarioLogado.restaurante_id;
            const data = await getFuncionarios(restaurante_id);
            const mapped = data.map((f: any) => ({
                id: f.id,
                name: f.nome,
                role: f.cargo,
                cpf: f.cpf,
                email: f.email,
                phone: f.telefone
            }));
            setEmployees(mapped);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    setFormError(null);
    setEmailError(false);
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
        const restaurante_id = usuarioLogado.restaurante_id;
        const employeeDataBackend: any = {
            nome: formData.get('name') as string,
            cargo: formData.get('role') as string,
            cpf: formData.get('cpf') as string,
            email: emailValue,
            telefone: formData.get('phone') as string,
            senha: formData.get('password') as string,
            restaurante_id
        };
        if (editingEmployee && !employeeDataBackend.senha) {
            delete employeeDataBackend.senha;
        }
        try {
            if (editingEmployee) {
                await updateFuncionario(editingEmployee.id, employeeDataBackend);
            } else {
                await createFuncionario(employeeDataBackend);
            }
            const data = await getFuncionarios(restaurante_id);
            const mapped = data.map((f: any) => ({
                id: f.id,
                name: f.nome,
                role: f.cargo,
                cpf: f.cpf,
                email: f.email,
                phone: f.telefone
            }));
            setEmployees(mapped);
            setIsModalOpen(false);
        } catch (err: any) {
            // Garante que qualquer erro relacionado a email será marcado
            const msg = (err && err.message) ? err.message.toLowerCase() : '';
            console.error('Erro ao salvar funcionário:', err);
            if (msg.includes('email') || msg.includes('e-mail')) {
                setFormError('E-mail já cadastrado. Escolha outro e-mail.');
                setEmailError(true);
            } else {
                setFormError('Erro ao salvar funcionário.');
            }
        }
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
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map((employee, index) => (
                                <tr key={index}>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.name}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.role}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.cpf}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">{employee.phone}</td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEditEmployee(employee)} className="text-gray-600 hover:text-blue-600"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteEmployee(employee)} className="text-gray-600 hover:text-red-600"><Trash2 size={18} /></button>
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
                    {formError && (
                        <div className="mb-2 text-red-600 text-sm font-semibold">{formError}</div>
                    )}
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Nome Completo</label>
                            <input type="text" name="name" placeholder="Nome do funcionário" defaultValue={editingEmployee?.name} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cargo</label>
                            <input type="text" name="role" placeholder="Ex: Garçom" defaultValue={editingEmployee?.role} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">CPF</label>
                            <input type="text" name="cpf" placeholder="000.000.000-00" defaultValue={editingEmployee?.cpf} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@exemplo.com"
                                value={emailValue}
                                onChange={e => setEmailValue(e.target.value)}
                                className={`w-full mt-1 p-2 border rounded-md ${emailError ? 'border-red-500 bg-red-50' : ''}`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Telefone</label>
                            <input type="tel" name="phone" placeholder="(00) 00000-0000" defaultValue={editingEmployee?.phone} className="w-full mt-1 p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Senha</label>
                            <input
                                type="password"
                                name="password"
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
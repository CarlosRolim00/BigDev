// Adicionar mesa ao restaurante
export async function addTable(restaurante_id: number, numero: string | number, capacidade: string | number, localizacao: string) {
    const response = await fetch(`${API_BASE_URL}/mesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurante_id, numero, capacidade, localizacao })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao adicionar mesa');
    }
    return response.json();
}

// Remover mesa por ID
export async function deleteTable(mesa_id: number) {
    const response = await fetch(`${API_BASE_URL}/mesa/${mesa_id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao remover mesa');
    }
    return response.json();
}
// Buscar mesas de um restaurante
export async function getTablesByRestaurante(restaurante_id: number) {
    const response = await fetch(`${API_BASE_URL}/mesa/restaurante/${restaurante_id}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar mesas do restaurante');
    }
    return response.json();
}
// Buscar dados de um restaurante por ID
export async function getRestauranteById(id: number) {
    const response = await fetch(`${API_BASE_URL}/restaurante/${id}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar restaurante');
    }
    return response.json();
}

// Atualizar dados do restaurante
export async function updateRestaurante(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/restaurante/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar restaurante');
    }
    return response.json();
}
// Buscar reservas do restaurante
export async function getReservasByRestaurante(restaurante_id: number, dia?: string) {
    let url = `${API_BASE_URL}/reserva/restaurante/${restaurante_id}`;
    if (dia) {
        url += `?dia=${dia}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erro ao buscar reservas do restaurante');
    }
    return response.json();
}
// Função para login de funcionário
export async function loginFuncionario(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/funcionario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer login de funcionário');
    }
    return response.json();
}
// Buscar restaurantes do backend
export async function getRestaurantes() {
    const response = await fetch(`${API_BASE_URL}/restaurante`);
    if (!response.ok) {
        throw new Error('Erro ao buscar restaurantes');
    }
    return response.json();
}
// Buscar reservas do cliente
export async function getReservasByCliente(cliente_id: number) {
    const response = await fetch(`${API_BASE_URL}/reserva/cliente/${cliente_id}`);
    if (!response.ok) {
        throw new Error('Erro ao buscar reservas');
    }
    return response.json();
}
// URL base do backend
export const API_BASE_URL = "http://localhost:3000";

// Função para login
export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/cliente/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer login');
    }
    return response.json();
}

// Função para cadastro
export async function registerUser(nome: string, email: string, senha: string, telefone: string) {
    const response = await fetch(`${API_BASE_URL}/cliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, telefone })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao cadastrar');
    }
    return response.json();
}
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
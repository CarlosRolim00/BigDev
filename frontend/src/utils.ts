// Atualizar status do restaurante por id (mantendo os outros campos)
export async function updateRestauranteStatus(id: string | number, status: 'ativo' | 'cancelado') {
    // Busca o restaurante atual
    const response = await fetch(`${API_BASE_URL}/restaurante/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar restaurante para atualizar status');
    const restaurante = await response.json();
    // Monta o objeto com todos os campos necessários
    const data = {
        nome: restaurante.nome,
        cnpj: restaurante.cnpj,
        endereco: restaurante.endereco,
        telefone: restaurante.telefone,
        tipo_cozinha: restaurante.tipo_cozinha,
        status
    };
    return updateRestaurante(Number(id), data);
}
// Buscar todos os restaurantes (para master)
export async function getAllRestaurantes() {
    const response = await fetch(`${API_BASE_URL}/restaurante`);
    if (!response.ok) {
        throw new Error('Erro ao buscar todos os restaurantes');
    }
    return response.json();
}
// Buscar todos os clientes (para master)
export async function getAllClientes() {
    const response = await fetch(`${API_BASE_URL}/cliente`);
    if (!response.ok) {
        throw new Error('Erro ao buscar todos os clientes');
    }
    return response.json();
}
// Buscar todas as reservas (para master)
export async function getAllReservas() {
    const response = await fetch(`${API_BASE_URL}/reserva`);
    if (!response.ok) {
        throw new Error('Erro ao buscar todas as reservas');
    }
    return response.json();
}
// Função para criar avaliação
export async function createAvaliacao(data: { cliente_id: number, restaurante_id: number, nota: number, comentario: string, data: string, hora?: string }) {
    const response = await fetch(`${API_BASE_URL}/avaliacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao enviar avaliação');
    }
    return response.json();
}
// Upload da imagem do restaurante
export async function uploadRestauranteImage(restaurante_id: number, file: File, form: any) {
    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('nome', form.nome);
    formData.append('cnpj', form.cnpj);
    formData.append('endereco', form.endereco);
    formData.append('telefone', form.telefone);
    formData.append('tipo_cozinha', form.tipo_cozinha);
    const response = await fetch(`${API_BASE_URL}/restaurante/${restaurante_id}`, {
        method: 'PUT',
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
    }
    return response.json();
}
// --- CARDÁPIO ---
export async function getCardapios() {
    const response = await fetch(`${API_BASE_URL}/cardapio`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao buscar cardápios');
    }
    return response.json();
}

export async function createCardapio(data: { nome: string, caminho_pdf: string, restaurante_id: number }) {
    const response = await fetch(`${API_BASE_URL}/cardapio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar cardápio');
    }
    return response.json();
}

export async function updateCardapio(id: number, data: { nome: string, file?: File }) {
    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.file) {
        formData.append('file', data.file);
    }
    const response = await fetch(`${API_BASE_URL}/cardapio/${id}`, {
        method: 'PUT',
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar cardápio');
    }
    return response.json();
}

export async function deleteCardapio(id: number) {
    const response = await fetch(`${API_BASE_URL}/cardapio/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok && response.status !== 204) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao remover cardápio');
    }
    return {};
}
// Função para cadastrar restaurante e criar funcionário gerente
export async function registerRestauranteComGerente(
    nome: string,
    cnpj: string,
    endereco: string,
    telefone: string,
    tipo_cozinha: string,
    email: string,
    senha: string
) {
    // 1. Cadastra o restaurante (enviando apenas os campos esperados)
    const restaurante = await registerRestaurante(nome, cnpj, endereco, telefone, tipo_cozinha);
    // 2. Cria funcionário gerente vinculado ao restaurante
    const funcionarioResponse = await fetch(`${API_BASE_URL}/funcionario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: nome + ' (Gerente)',
            email,
            senha,
            telefone, // telefone do restaurante também para o gerente
            cargo: 'gerente',
            cpf: '00000000000',
            restaurante_id: restaurante.id || restaurante._id || restaurante.restaurante_id || restaurante.restauranteId || restauranteIdFromResponse(restaurante)
        })
    });
    if (!funcionarioResponse.ok) {
        const errorData = await funcionarioResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar funcionário gerente');
    }
    const funcionario = await funcionarioResponse.json();
    return { restaurante, funcionario };
}

// Função auxiliar para extrair id do restaurante de diferentes formatos de resposta
function restauranteIdFromResponse(restaurante: any) {
    return restaurante.id || restaurante._id || restaurante.restaurante_id || restaurante.restauranteId;
}
// Função para cadastro de restaurante
export async function registerRestaurante(
    nome: string,
    cnpj: string,
    endereco: string,
    telefone: string,
    tipo_cozinha: string
) {
    const response = await fetch(`${API_BASE_URL}/restaurante`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cnpj, endereco, telefone, tipo_cozinha })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.message && errorData.message.toLowerCase().includes('cnpj')) {
            throw new Error('Já existe um restaurante cadastrado com esse CNPJ.');
        }
        throw new Error(errorData.message || 'Erro ao cadastrar restaurante');
    }
    return response.json();
}
// Adicionar mesa ao restaurante
export async function addTable(restaurante_id: number, numero: string | number, capacidade: string | number, localizacao: string) {
    const response = await fetch(`${API_BASE_URL}/mesa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurante_id, numero, capacidade, localizacao, status: 'disponivel' })
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

// Busca cliente pelo id do usuário
export async function getClienteByUsuarioId(usuario_id: number) {
    const response = await fetch(`${API_BASE_URL}/cliente/usuario/${usuario_id}`);
    if (!response.ok) {
        throw new Error('Cliente não encontrado para este usuário');
    }
    return response.json();
}

// Atualiza dados do cliente
export async function updateCliente(
    id: number,
    data: { nome: string; email: string; telefone: string; senha: string; status_conta?: string }
) {
    const response = await fetch(`${API_BASE_URL}/cliente/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
    }
    return response.json();
}

// Funcionários
export async function getFuncionarios(restaurante_id?: number) {
    let url = `${API_BASE_URL}/funcionario`;
    if (restaurante_id) {
        url += `?restaurante_id=${restaurante_id}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Erro ao buscar funcionários');
    }
    return response.json();
}

export async function createFuncionario(data: any) {
    const response = await fetch(`${API_BASE_URL}/funcionario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar funcionário');
    }
    return response.json();
}

export async function updateFuncionario(id: number, data: any) {
    const response = await fetch(`${API_BASE_URL}/funcionario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao atualizar funcionário');
    }
    return response.json();
}

export async function deleteFuncionario(id: number) {
    const response = await fetch(`${API_BASE_URL}/funcionario/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao remover funcionário');
    }
    // Se o status for 204 (No Content), não tente fazer parse de JSON
    if (response.status === 204) {
        return {};
    }
    return response.json();
}
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
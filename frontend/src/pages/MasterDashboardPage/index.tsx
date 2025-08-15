// Utilitário para formatar CNPJ no padrão XX.XXX.XXX/XXXX-XX
function formatCNPJ(cnpj?: string | null): string {
    if (!cnpj) return '-';
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) return cnpj;
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
// Componente para exibir os últimos clientes cadastrados
function LastClients() {
    const [clients, setClients] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        async function fetchClients() {
            setLoading(true);
            setError('');
            try {
                const all = await getAllClientes();
                // Ordena por data de cadastro decrescente (assume campo data_cadastro ou dataCadastro)
                const sorted = [...all].sort((a, b) => {
                    const da = new Date(a.data_cadastro || a.dataCadastro || a.createdAt || 0).getTime();
                    const db = new Date(b.data_cadastro || b.dataCadastro || b.createdAt || 0).getTime();
                    return db - da;
                });
                setClients(sorted.slice(0, 5));
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar clientes');
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Últimos Clientes Cadastrados</h3>
            {loading ? (
                <div className="text-center text-gray-500">Carregando...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : clients.length === 0 ? (
                <div className="text-center text-gray-500">Nenhum cliente encontrado.</div>
            ) : (
                <ul className="space-y-4">
                    {clients.map((c, idx) => (
                        <li key={idx} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                            <span className="font-semibold text-sm">{c.usuario_nome || (c.usuario && c.usuario.nome) || c.nome || '-'}</span>
                            <span className="text-xs text-gray-500">{c.email}</span>
                            <span className="text-xs text-gray-400">{c.data_cadastro ? new Date(c.data_cadastro).toLocaleDateString('pt-BR') : ''}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

import React from 'react';
import { Building2, Users, CalendarCheck2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAllClientes, getAllRestaurantes, getAllReservas, updateRestauranteStatus } from '../../utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// Painel de ações pendentes para restaurantes
function PendingRestaurantsPanel() {
    const [pending, setPending] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [actionLoading, setActionLoading] = React.useState<string | null>(null);

    const fetchPending = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const all = await getAllRestaurantes();
            setPending(all.filter((r: any) => (r.status || '').toLowerCase() === 'pendente'));
        } catch (err: any) {
            setError(err.message || 'Erro ao buscar restaurantes pendentes');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchPending();
    }, [fetchPending]);

    async function handleStatusChange(id: string, status: 'ativo' | 'cancelado') {
        setActionLoading(id + status);
        try {
            await updateRestauranteStatus(id, status);
            await fetchPending();
        } catch (err) {
            // Optionally show error
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h3 className="font-bold text-lg mb-4">Ações Pendentes</h3>
            {loading ? (
                <div className="text-center text-gray-500">Carregando...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : pending.length === 0 ? (
                <div className="text-center text-gray-500">Nenhum restaurante pendente.</div>
            ) : (
                <div className="space-y-4">
                    {pending.map((resto) => (
                        <div key={resto.id || resto._id} className="flex flex-col p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="font-semibold text-sm">{resto.nome}</p>
                            <p className="text-xs text-gray-500 mb-2">{resto.email}</p>
                            <div className="flex gap-2">
                                <button
                                    className="text-xs bg-green-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-green-600 disabled:opacity-60"
                                    disabled={actionLoading === (resto.id + 'ativo')}
                                    onClick={() => handleStatusChange(resto.id || resto._id, 'ativo')}
                                >
                                    {actionLoading === (resto.id + 'ativo') ? 'Salvando...' : 'Aprovar'}
                                </button>
                                <button
                                    className="text-xs bg-red-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-600 disabled:opacity-60"
                                    disabled={actionLoading === (resto.id + 'cancelado')}
                                    onClick={() => handleStatusChange(resto.id || resto._id, 'cancelado')}
                                >
                                    {actionLoading === (resto.id + 'cancelado') ? 'Salvando...' : 'Recusar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const chartOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Reservas nos Últimos 7 Dias' },
    },
};
const chartData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
        {
            label: 'Nº de Reservas',
            data: [12, 19, 8, 15, 25, 32, 28],
            backgroundColor: 'rgba(37, 99, 235, 0.8)',
        },
    ],
};

export default function MasterDashboardPage() {
    const [metrics, setMetrics] = React.useState({ clientes: 0, restaurantes: 0, reservas: 0 });
    React.useEffect(() => {
        async function fetchMetrics() {
            try {
                const [clientes, restaurantes, reservas] = await Promise.all([
                    getAllClientes(),
                    getAllRestaurantes(),
                    getAllReservas()
                ]);
                setMetrics({ clientes: clientes.length, restaurantes: restaurantes.length, reservas: reservas.length });
            } catch {}
        }
        fetchMetrics();
    }, []);
    return (
        <div className="space-y-6">
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                    <Users className="text-blue-500" size={32} />
                    <div>
                        <div className="text-2xl font-bold">{metrics.clientes}</div>
                        <div className="text-gray-500 text-sm">Clientes</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                    <Building2 className="text-green-500" size={32} />
                    <div>
                        <div className="text-2xl font-bold">{metrics.restaurantes}</div>
                        <div className="text-gray-500 text-sm">Restaurantes</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex items-center gap-4">
                    <CalendarCheck2 className="text-purple-500" size={32} />
                    <div>
                        <div className="text-2xl font-bold">{metrics.reservas}</div>
                        <div className="text-gray-500 text-sm">Reservas</div>
                    </div>
                </div>
            </div>




        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Atividade (ocupando 2 colunas) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <Bar options={chartOptions} data={chartData} />
            </div>
            <PendingRestaurantsPanel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimos clientes cadastrados */}
            <LastClients />
            {/* Listas Rápidas (agora em uma só coluna) */}
            <div className="space-y-6">
                <LastRestaurants />
            </div>
        </div>


    </div>
    );
}
// Componente para exibir os últimos clientes cadastrados


// Componente para exibir os últimos restaurantes cadastrados
function LastRestaurants() {
    const [restaurantes, setRestaurantes] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        async function fetchRestaurantes() {
            setLoading(true);
            setError('');
            try {
                const all = await getAllRestaurantes();
                    console.log('DEBUG restaurantes recebidos:', all);
                    console.log('DEBUG estrutura completa restaurantes:', JSON.stringify(all, null, 2));
                    all.forEach((r: any, i: number) => console.log(`Restaurante[${i}] id=`, r.id, 'nome=', r.nome));
                // Ordena por data de registro decrescente (assume campo data_registro, dataRegistro ou createdAt)
                const sorted = [...all].sort((a, b) => {
                    const da = new Date(a.data_registro || a.dataRegistro || a.createdAt || 0).getTime();
                    const db = new Date(b.data_registro || b.dataRegistro || b.createdAt || 0).getTime();
                    return db - da;
                });
                setRestaurantes(sorted.slice(0, 5));
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar restaurantes');
            } finally {
                setLoading(false);
            }
        }
        fetchRestaurantes();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">Últimos Restaurantes Cadastrados</h3>
            {loading ? (
                <div className="text-center text-gray-500">Carregando...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : restaurantes.length === 0 ? (
                <div className="text-center text-gray-500">Nenhum restaurante encontrado.</div>
            ) : (
                <ul className="space-y-4">
                    {restaurantes.filter(r => r.nome).map((r, idx) => (
                        <li key={r.id || r._id || idx} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
                            <span className="font-semibold text-sm">{r.nome}</span>
                            <span className="text-xs text-gray-500">{r.email || formatCNPJ(r.cnpj) || '-'}</span>
                            <span className="text-xs text-gray-400">{(r.data_registro || r.dataRegistro || r.createdAt) ? new Date(r.data_registro || r.dataRegistro || r.createdAt).toLocaleDateString('pt-BR') : ''}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

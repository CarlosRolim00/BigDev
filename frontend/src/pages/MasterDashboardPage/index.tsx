import React from 'react';
import { Building2, Users, CalendarCheck2, Clock, CheckCircle } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dados mocados
const recentRestaurants = [
    { name: 'Cantina da Serra', email: 'contato@cantina.com', date: '12/08/2025' },
    { name: 'Sushi Express', email: 'falecom@sushiexpress.com', date: '11/08/2025' },
];
const recentClients = [
    { name: 'Marcos Andrade', email: 'marcos.a@email.com', date: '13/08/2025' },
    { name: 'Juliana Costa', email: 'juliana.c@email.com', date: '13/08/2025' },
];
// 1. Dados para as novas seções
const pendingRestaurants = [
    { name: 'Churrascaria Fogo no Chão', email: 'contato@fogonochao.com' },
];
const recentActivity = [
    { text: "Cliente 'Ana Clara' fez uma reserva no 'PollGreen Irish Pub'." },
    { text: "Restaurante 'Pizzaria Napolitana' acaba de se cadastrar e aguarda aprovação." },
    { text: "Cliente 'Ricardo Mendes' avaliou o restaurante 'Blu Méditerranée'." },
];

// Configurações do gráfico
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
  return (
    <div className="space-y-6">
        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ... cards ... */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gráfico de Atividade (ocupando 2 colunas) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <Bar options={chartOptions} data={chartData} />
            </div>

            {/* 2. Nova Seção: Ações Pendentes (ocupando 1 coluna) */}
            <div className="bg-white p-6 rounded-lg shadow">
                 <h3 className="font-bold text-lg mb-4">Ações Pendentes</h3>
                 <div className="space-y-4">
                    {pendingRestaurants.map((resto, index) => (
                        <div key={index} className="flex flex-col p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                            <p className="font-semibold text-sm">{resto.name}</p>
                            <p className="text-xs text-gray-500 mb-2">{resto.email}</p>
                            <button className="text-xs bg-yellow-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-yellow-600 self-start">
                                Revisar Cadastro
                            </button>
                        </div>
                    ))}
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* 3. Nova Seção: Feed de Atividade Recente */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">Feed de Atividade Recente</h3>
                <ul className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle size={18} className="text-green-500 mt-1 flex-shrink-0" />
                            <span>{activity.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Listas Rápidas (agora em uma só coluna) */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Últimos Restaurantes Cadastrados</h3>
                    {/* ... lista ... */}
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Últimos Clientes Cadastrados</h3>
                    {/* ... lista ... */}
                </div>
            </div>
        </div>
    </div>
  );
}
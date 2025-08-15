import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react';
import { useState } from 'react';
import RestaurantePerfilModal from './RestaurantePerfilModal';
import { API_BASE_URL } from '../../utils';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Administrador deslogado!");
    navigate('/restaurant-login');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black';

  // Estado do modal de perfil
  const [perfilOpen, setPerfilOpen] = useState(false);
  const [restaurante, setRestaurante] = useState<any>(null);

  // Busca dados do restaurante logado (real do backend)
  const fetchRestaurante = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!usuario?.restaurante_id) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/restaurante/${usuario.restaurante_id}`);
      if (!resp.ok) throw new Error('Erro ao buscar restaurante');
      const data = await resp.json();
      setRestaurante(data);
    } catch {
      setRestaurante(null);
    }
  };

  const handlePerfilClick = async () => {
    await fetchRestaurante();
    setPerfilOpen(true);
  };

  const handlePerfilSave = async (formData: FormData) => {
    if (!restaurante?.id) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/restaurante/${restaurante.id}`, {
        method: 'PUT',
        body: formData
      });
      if (!resp.ok) throw new Error('Erro ao atualizar restaurante');
    } catch (e) {
      // Pode exibir erro se quiser
    }
    setPerfilOpen(false);
    fetchRestaurante();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho do Admin */}
      <header className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
        <nav className="flex items-center gap-8">
          <h1 className="text-xl font-bold">Painel do Restaurante</h1>
          <div className="border-l h-6"></div>
          <NavLink to="/admin/reservations" className={getNavLinkClass}>Reservas</NavLink>
          <NavLink to="/admin/menu" className={getNavLinkClass}>Cardápio</NavLink>
          <NavLink to="/admin/settings" className={getNavLinkClass}>Configurações da loja</NavLink>
          <NavLink to="/admin/employees" className={getNavLinkClass}>Funcionários</NavLink>
        </nav>
        <div className="flex items-center gap-6">
          <Bell size={24} className="text-gray-600 cursor-pointer" />
          <button onClick={handlePerfilClick} title="Perfil do restaurante">
            <UserCircle size={32} className="text-gray-600 cursor-pointer" />
          </button>
          <button onClick={handleLogout} className="font-semibold text-gray-600 hover:text-black">
            Sair
          </button>
        </div>
      </header>

      {/* Modal de perfil do restaurante */}
      <RestaurantePerfilModal
        isOpen={perfilOpen}
        onClose={() => setPerfilOpen(false)}
        restaurante={restaurante}
        onSave={handlePerfilSave}
      />

      {/* Conteúdo principal da página admin */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
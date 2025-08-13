import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Administrador deslogado!");
    navigate('/restaurant-login');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black';

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
          {/* O link de Perfil agora é Funcionários e aponta para a nova rota */}
          <NavLink to="/admin/employees" className={getNavLinkClass}>Funcionários</NavLink>
        </nav>
        <div className="flex items-center gap-6">
          <Bell size={24} className="text-gray-600 cursor-pointer" />
          <UserCircle size={32} className="text-gray-600 cursor-pointer" />
          <button onClick={handleLogout} className="font-semibold text-gray-600 hover:text-black">
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo principal da página admin */}
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
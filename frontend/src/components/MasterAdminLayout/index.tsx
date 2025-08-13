import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function MasterAdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/master/login');
  };

  // Função para estilizar os links. Agora inclui o efeito hover.
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const baseClasses = 'block px-4 py-2 rounded-md transition-colors duration-150';
    const activeClasses = 'bg-gray-700 text-white';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Barra Lateral de Navegação */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Plataforma Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {/* A função agora é passada diretamente para o className */}
          <NavLink to="/master/dashboard" className={getNavLinkClass}>Dashboard</NavLink>
          <NavLink to="/master/restaurants" className={getNavLinkClass}>Restaurantes</NavLink>
          <NavLink to="/master/users" className={getNavLinkClass}>Clientes</NavLink>
          <NavLink to="/master/bookings" className={getNavLinkClass}>Reservas</NavLink>
        </nav>
        <div className="px-6 py-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate
import { Bell, UserCircle } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate(); // 2. Inicialize o hook

  // 3. Crie a função de logout
  const handleLogout = () => {
    // No futuro, aqui entraria a lógica para limpar os dados de login do admin
    console.log("Administrador deslogado!");
    navigate('/admin/login'); // Redireciona para o login do admin
  };

  // Helper para estilizar o link ativo
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
          <NavLink to="/admin/profile" className={getNavLinkClass}>Perfil</NavLink>
        </nav>
        <div className="flex items-center gap-6">
          <Bell size={24} className="text-gray-600 cursor-pointer" />
          <UserCircle size={32} className="text-gray-600 cursor-pointer" />
          {/* 4. Adicione o botão de Sair */}
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
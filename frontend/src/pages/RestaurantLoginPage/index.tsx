import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RestaurantLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação do restaurante
    navigate('/admin/reservations'); 
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Login do Restaurante</h2>
          <p className="text-center text-gray-600 mb-6">Acesse seu painel de controle</p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 font-medium">Email</label>
              <input
                type="email"
                placeholder="seu@restaurante.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Senha</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold text-sm">
              Entrar
            </button>
            <div className="text-sm text-center">
              Não tem uma conta? <Link to="/admin/signup" className="font-semibold underline">Cadastre seu restaurante</Link>
            </div>
            <div className="text-center pt-4 border-t mt-4">
                 <Link to="/login" className="text-sm text-gray-500 hover:underline">
                    É um cliente? Faça login aqui
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

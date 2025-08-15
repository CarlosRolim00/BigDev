import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function MasterLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/master-usuario/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Usuário ou senha inválidos');
        return;
      }
      const usuario = await res.json();
      localStorage.setItem('masterUsuarioLogado', JSON.stringify({ id: usuario.id, nome: usuario.nome, email: usuario.email }));
      navigate('/master/dashboard');
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Acesso ao Sistema</h2>
          <p className="text-center text-gray-400 mb-6">Administração da Plataforma</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <div className="text-red-400 text-center text-sm mb-2">{error}</div>}
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-300">Email</label>
              <input
                type="email"
                placeholder="admin@sistema.com"
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-300">Senha</label>
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold text-sm transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
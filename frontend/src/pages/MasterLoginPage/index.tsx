import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MasterLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // No futuro, aqui entraria a lógica de autenticação do Master
    console.log("Tentativa de login Master:", { email, password });
    
    // Por enquanto, redireciona direto para um futuro dashboard
    // A rota /master/dashboard será criada nos próximos passos
    navigate('/master/dashboard'); 
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Acesso ao Sistema</h2>
          <p className="text-center text-gray-400 mb-6">Administração da Plataforma</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
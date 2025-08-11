import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginFuncionario } from '../../utils';

const RestaurantLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await loginFuncionario(email, password);
      if (result.usuario && result.funcionario) {
        localStorage.setItem('usuarioLogado', JSON.stringify({
          ...result.usuario,
          tipo: 'funcionario',
          funcionario: result.funcionario,
          restaurante_id: result.funcionario.restaurante_id,
          restaurante_nome: result.funcionario.restaurante_nome
        }));
  navigate('/admin/reservations');
      } else {
        setError(result.message || 'Email ou senha inválidos.');
      }
    } catch (err: any) {
      setError(err.message || 'Email ou senha inválidos.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 rounded-xl shadow-md bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login do Restaurante</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="SeuNome@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold text-sm">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestaurantLogin;

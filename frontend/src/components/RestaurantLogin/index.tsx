import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginFuncionario } from '../../utils';

const RestaurantLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Limpa o estado ao desmontar o componente (sair da página)
  useEffect(() => {
    return () => {
      setEmail('');
      setPassword('');
      setError('');
      // Remover localStorage.removeItem('usuarioLogado') para não apagar o login ao navegar
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await loginFuncionario(email, password);
      console.log('loginFuncionario result:', result);
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
                className="w-full px-4 py-2 border borde  r-gray-300 rounded-md"
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
            {error && (
              <div className="text-red-500 text-sm text-center mb-2">{error}</div>
            )}
            <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold text-sm">
              Entrar
            </button>
            <div className="text-sm text-center">
              Não tem uma conta? <Link to="/admin/signup" className="font-semibold underline">Cadastre seu restaurante</Link>
            </div>

            {/* Link para o login do cliente adicionado aqui */}
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
};

export default RestaurantLogin;

import React, { useState, useEffect } from 'react';
import { registerUser } from '../../utils';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  // --- TODA A SUA LÓGICA DE ESTADOS E FUNÇÕES CONTINUA A MESMA ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (password.length > 0 && password.length < 8) {
      setPasswordError('A senha deve ter no mínimo 8 caracteres.');
    } else if (password.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('A senha deve conter pelo menos um símbolo (ex: @, !, #).');
    } else {
      setPasswordError('');
    }
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwordError || confirmPasswordError) {
      alert("Por favor, corrija os erros no formulário.");
      return;
    }
    try {
      await registerUser(fullName, email, password, phone);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      alert(err.message || 'Erro ao cadastrar');
    }
  };
  // -----------------------------------------------------------------

  return (
    // Container principal alterado para centralizar a caixa do formulário
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Vamos começar</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Nome Completo</label>
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="seunome@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Telefone</label>
            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-600 bg-gray-50">
                🇧🇷 +55
              </span>
              <input
                type="tel"
                placeholder="6165415644"
                className="w-full px-4 py-2 border border-gray-300 rounded-r-md"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Criar senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm text-gray-500"
              >
                👁
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Confirme sua senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="********"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 text-sm text-gray-500"
              >
                👁
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-semibold text-sm"
          >
            Cardastrar
          </button>
          <div className="text-sm text-center mt-2">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-semibold underline">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
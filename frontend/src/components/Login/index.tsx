import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../utils';

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [credentialError, setCredentialError] = useState('');

  useEffect(() => {
    if (credential.length === 0) {
      setCredentialError('');
      return;
    }
    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credential)) {
        setCredentialError('Por favor, insira um e-mail válido.');
      } else {
        setCredentialError('');
      }
    } else { // loginMethod === 'phone'
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(credential)) {
        setCredentialError('Por favor, insira apenas números.');
      } else {
        setCredentialError('');
      }
    }
  }, [credential, loginMethod]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (credentialError) {
      alert("Por favor, corrija os erros no formulário.");
      return;
    }
    if (!agreedToTerms) {
      alert("Você precisa concordar com os Termos e Condições.");
      return;
    }
    try {
      if (loginMethod !== 'email') {
        alert('Login por telefone não implementado. Use email.');
        return;
      }
      const result = await loginUser(credential, password);
      if (result.usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(result.usuario));
        navigate('/homescreen');
      } else {
        alert(result.message || 'Email ou senha inválidos.');
      }
    } catch (err: any) {
      alert(err.message || 'Email ou senha inválidos.');
    }
  };

  return (
    // Container principal alterado para centralizar a caixa do formulário
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Bem Vindo ao Mesa Certa</h2>
        <div className="flex justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setCredential(''); }}
            className={`px-4 py-2 border rounded-md w-24 text-sm ${loginMethod === 'email' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'
              }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('phone'); setCredential(''); }}
            className={`px-4 py-2 border rounded-md w-24 text-sm ${loginMethod === 'phone' ? 'bg-black text-white' : 'bg-white text-black border-gray-300'
              }`}
          >
            Phone
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">
              {loginMethod === 'email' ? 'Email' : 'Telefone'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={loginMethod === 'email' ? 'SeuNome@email.com' : '(00) 00000-0000'}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
            {credentialError && <p className="text-red-500 text-xs mt-1">{credentialError}</p>}
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
          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              className="mr-2"
              id="termos"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <label htmlFor="termos">Concordo com os Termos e Condições e a Política de Privacidade</label>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded-md font-semibold text-sm">
            Entrar
          </button>
          <div className="text-sm text-center">
            Não tem uma conta? <Link to="/Signup" className="font-semibold underline">Inscreva-se</Link>
          </div>
        {/*}  <div className="text-sm text-center">
            <Link to="/homescreen" className="text-gray-700 underline">Continuar como convidado</Link>
          </div> */}
          <div className="text-center pt-4 border-t mt-4">
            <Link to="/restaurant-login" className="text-sm text-gray-500 hover:underline">
              É um restaurante? Faça login aqui
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
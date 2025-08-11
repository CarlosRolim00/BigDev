import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate

export default function AdminSignupPage() {
  const navigate = useNavigate(); // 2. Inicialize o hook
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoCozinha, setTipoCozinha] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      nome,
      cnpj,
      endereco,
      telefone,
      tipoCozinha,
      email,
      password,
    });
    alert('Restaurante cadastrado com sucesso!');
    // 3. Redireciona para a página de login do admin
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 py-8">
      <div className="w-full flex items-center justify-center">
        <div className="w-full max-w-lg p-8 rounded-xl shadow-lg bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Cadastre seu Restaurante</h2>
          <p className="text-center text-gray-600 mb-6">Comece a gerenciar suas reservas</p>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 font-medium">Nome do Restaurante</label>
                <input
                  type="text"
                  placeholder="Nome do seu estabelecimento"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">CNPJ</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Endereço</label>
              <input
                type="text"
                placeholder="Rua, Número, Bairro, Cidade - Estado"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 font-medium">Telefone</label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Tipo de Cozinha</label>
                <input
                  type="text"
                  placeholder="Ex: Italiana, Japonesa, Brasileira"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={tipoCozinha}
                  onChange={(e) => setTipoCozinha(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 font-medium">Email de Contato</label>
              <input
                type="email"
                placeholder="contato@restaurante.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Crie uma Senha</label>
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
              Cadastrar
            </button>
            <div className="text-sm text-center">
              Já tem uma conta? <Link to="/admin/login" className="font-semibold underline">Entrar</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
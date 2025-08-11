
import { Link, useNavigate, useLocation } from "react-router-dom";

function getPrimeiroNome() {
  try {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!usuario) return 'Usuário';
    if (usuario.convidado) return 'Convidado';
    if (usuario.nome) return usuario.nome.split(' ')[0];
    if (usuario.email) return usuario.email.split('@')[0];
    return 'Usuário';
  } catch {
    return 'Usuário';
  }
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber a página atual

  const handleLogout = () => {
    console.log("Usuário deslogado!");
    navigate("/login");
  };

  // 1. Verificamos se a página atual é a de Login OU a de Signup
  const isAuthPage = location.pathname.toLowerCase() === '/login' || 
                     location.pathname.toLowerCase() === '/signup' || 
                     location.pathname === '/';

  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* Título */}
      <div className="text-lg font-medium">
        Bem Vindo ao <span className="font-bold">NomeApp</span>
      </div>

      {/* Navegação */}
      <nav>
        {isAuthPage ? (
          // 2. Se for Login OU Signup, mostra apenas "Contate-nos"
          <a href="#" className="hover:underline">Contate-nos</a>
        ) : (
          // Em todas as outras páginas, mostra a navegação completa
          <div className="flex items-center space-x-6">
            <Link to="/homescreen" className="border-b-2 border-black pb-1">Home</Link>
            <a href="#" className="hover:underline">Contate-nos</a>
            <button onClick={handleLogout} className="font-semibold hover:underline">Sair</button>

            <div className="h-6 border-l border-black mx-2" />

            <Link to="/profile" className="flex items-center space-x-2">
              <span className="text-sm">{getPrimeiroNome()}</span>
              <img
                src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-red-200"
              />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
import { Link } from "react-router-dom";
import FooterImage from "../../assets/footer.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-neutral-900 to-neutral-800 text-white pt-12 pb-6 px-4">
      {/* Imagem de fundo */}
      <div>
        <img src={FooterImage} alt="Banner" className="w-full object-cover mb-0" />
      </div>

      {/* Texto e botão */}
      <div className="text-center -mt-8 z-10 relative px-4">
        <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">
          CADASTRE-SE GRATUITAMENTE
        </h3>
        <p className="text-gray-200 text-sm sm:text-base mb-4">
          Cadastre-se conosco e ganhe <br className="hidden sm:block" />
          incríveis pontos de desconto em reservas de mesa
        </p>
        <Link
          to="/SignUp"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition inline-block"
        >
          Cadastre-se
        </Link>
      </div>

      {/* Conteúdo do rodapé */}
      <div className="max-w-6xl mx-auto text-center space-y-6 mt-6">
        <h2 className="text-2xl font-semibold">
          Reserva<span className="font-bold">Mesa</span>
        </h2>

        <nav className="flex justify-center flex-wrap gap-6 text-sm">
          <a href="#" className="hover:text-gray-300 transition">Serviços</a>
          <a href="#" className="hover:text-gray-300 transition">Sobre Nós</a>
          <a href="#" className="hover:text-gray-300 transition">Nosso Contato</a>
          <a href="#" className="hover:text-gray-300 transition">FAQs</a>
          <a href="#" className="hover:text-gray-300 transition">Entrar</a>
        </nav>

        {/* O Bloco com os ícones de redes sociais foi removido daqui */}

        <p className="text-xs text-gray-400">TableBooky.com | All rights reserved</p>
      </div>
    </footer>
  );
}
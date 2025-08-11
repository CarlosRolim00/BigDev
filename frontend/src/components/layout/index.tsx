import { Outlet, Link } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

export default function Layout() {
    return (
        <div>
            {/* Cabeçalho */}
            <Header/>

            {/* Conteúdo da rota */}
            <main style={{ padding: '2rem' }}>
                <Outlet />
            </main>

            {/* Rodapé */}
            <Footer/>
            
        </div>
    );
}
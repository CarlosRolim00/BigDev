import { Routes, Route } from "react-router-dom";
import Homescreen from "../pages/Homescreen";
import Layout from "../components/layout";
import Login from "../components/Login";
import Signup from "../components/Signup";
import RestaurantPage from "../pages/RestaurantPage";
import RestaurantLogin from "../components/RestaurantLogin";
import ProfilePage from "../pages/ProfilePage";
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminSignupPage from "../pages/AdminSignupPage";
import AdminLayout from "../components/AdminLayout";
import AdminReservationsPage from "../pages/AdminReservationsPage";
import AdminMenuPage from "../pages/AdminMenuPage";
import AdminSettingsPage from "../pages/AdminSettingsPage"; // 1. Importe a nova página

export default function Router() {
    return (
        <Routes>
            {/* Rotas dos Clientes (com Header e Footer) */}
            <Route element={<Layout />}>
                <Route path="/homescreen" element={<Homescreen />} />
                <Route path="/restaurant/:id" element={<RestaurantPage />} /> 
                <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            {/* Rotas de Autenticação (Cliente e Admin) */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/restaurant-login" element={<RestaurantLogin />} />
            <Route path="/admin/signup" element={<AdminSignupPage />} />

            {/* Rotas do Painel Admin (com o layout de admin) */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="reservations" element={<AdminReservationsPage />} />
                <Route path="menu" element={<AdminMenuPage />} />
                <Route path="settings" element={<AdminSettingsPage />} /> {/* 2. Adicione a nova rota */}
            </Route>
        </Routes>
    );
}
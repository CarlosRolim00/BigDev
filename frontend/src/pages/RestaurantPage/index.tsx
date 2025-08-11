import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRestaurantes } from '../../utils';
import { MapPin, Clock, Utensils, Send } from "lucide-react";
import LocationCard from "../../components/LocationCard";
import OfficialSitesCard from "../../components/OfficialSitesCard";


function RestaurantPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (id) {
            getRestaurantes()
                .then(data => {
                    const found = data.find((r: any) => String(r.id) === String(id));
                    setRestaurant(found);
                })
                .catch(() => setErro('Erro ao buscar restaurante'))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div>Carregando restaurante...</div>;
    if (erro) return <div className="text-red-500">{erro}</div>;
    if (!restaurant) {
        return <div>Restaurante não encontrado.</div>;
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-gray-100">
                <div className="flex-1">
                    <Link to="/homescreen" className="text-sm font-semibold mb-4 inline-block">&lt; Voltar</Link>
                    <div className="bg-white rounded-xl shadow p-6">
                        <img src={restaurant.mainImage || restaurant.image} alt={restaurant.name} className="w-full h-64 object-cover rounded-md mb-4" />
                        <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <MapPin size={20} className="mr-3 mt-1 text-gray-500"/>
                                    <p>{restaurant.address}</p>
                                </div>
                                <a href="#" className="flex items-center font-semibold text-sm whitespace-nowrap text-gray-800">
                                    <Send size={16} className="mr-2"/>
                                    Mostrar Localização
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Clock size={20} className="mr-3 text-gray-500"/>
                                <p className="font-semibold text-black">{restaurant.hours}</p>
                            </div>
                            <div className="flex items-center">
                                <Utensils size={20} className="mr-3 text-gray-500"/>
                                <span className="underline cursor-pointer">Menu</span>
                            </div>
                        </div>
                        <div className="border-t my-6"></div>
                        <div>
                            <h3 className="font-semibold mb-3">Horários disponíveis</h3>
                            <div className="flex flex-wrap gap-3">
                                {restaurant.times && restaurant.times.map((time: string) => (
                                    <button key={time} className="bg-gray-200 text-black px-4 py-2 rounded-md font-semibold hover:bg-gray-300">
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4">
                    <div className="flex flex-col gap-6">
                        <LocationCard />
                        <OfficialSitesCard />
                    </div>
                </div>
            </div>
        </>
    );
}

export default RestaurantPage;
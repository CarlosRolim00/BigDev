
import React, { useEffect, useState } from "react";
import RestaurantCard from "../RestaurantCard";
import LocationCard from "../LocationCard/index";
import OfficialSitesCard from "../OfficialSitesCard/index";
import { getRestaurantes } from '../../utils';


export default function Main() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    getRestaurantes()
      .then(data => {
        // Adapta os dados do backend para o formato esperado pelo RestaurantCard
        const adaptados = data.map((rest: any) => ({
          id: rest.id,
          image: rest.image || '/images/peixes.jpg',
          name: rest.nome || rest.name || 'Restaurante',
          address: rest.endereco || rest.address || '',
          hours: rest.hours || '11:30 AM - 11:00 PM',
          times: rest.times || [],
          activeTime: rest.activeTime || '',
          ...rest
        }));
        setRestaurantes(adaptados);
      })
      .catch(() => setErro('Erro ao buscar restaurantes'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-gray-100">
      {/* Conteúdo principal */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Nossos Restaurantes</h2>
          {loading && <div>Carregando restaurantes...</div>}
          {erro && <div className="text-red-500">{erro}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantes.map((rest, index) => (
              <RestaurantCard key={rest.id || index} {...rest} />
            ))}
          </div>
        </div>
      </div>

      {/* Coluna lateral com cartões extras */}
      <div className="flex flex-col gap-6 w-full md:w-1/3 lg:w-1/4">
        <LocationCard />
        <OfficialSitesCard />
      </div>
    </main>
  );
}
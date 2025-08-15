
import React, { useEffect, useState } from "react";
import RestaurantCard from "../RestaurantCard";
import LocationCard from "../LocationCard/index";
import OfficialSitesCard from "../OfficialSitesCard/index";
import { getRestaurantes, API_BASE_URL } from '../../utils';


export default function Main() {
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [pagina, setPagina] = useState(1);
  const porPagina = 12;

  useEffect(() => {
    getRestaurantes()
      .then(data => {
        const adaptados = data
          .filter((rest: any) => (rest.status || rest.Status || '').toLowerCase() === 'ativo')
          .map((rest: any) => ({
            id: rest.id,
            image: `${API_BASE_URL}/restaurante/${rest.id}/imagem?v=${Date.now()}`,
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

  const totalPaginas = Math.ceil(restaurantes.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;
  const restaurantesPagina = restaurantes.slice(inicio, fim);

  return (
    <main className="flex flex-col md:flex-row gap-6 p-4 md:p-8 bg-gray-100">
      {/* Conteúdo principal */}
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Nossos Restaurantes</h2>
          {loading && <div>Carregando restaurantes...</div>}
          {erro && <div className="text-red-500">{erro}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurantesPagina.map((rest, index) => (
              <RestaurantCard key={rest.id || index} {...rest} />
            ))}
          </div>
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="px-3 py-1 rounded bg-gray-200 font-semibold"
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
              >Anterior</button>
              <span className="font-semibold">Página {pagina} de {totalPaginas}</span>
              <button
                className="px-3 py-1 rounded bg-gray-200 font-semibold"
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
              >Próxima</button>
            </div>
          )}
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
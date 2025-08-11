import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

// Dados mocados para os itens do cardápio
const menuItems = {
  mainCourses: [
    { name: 'Frango Grelhado com Legumes', description: 'Suculento filé de frango grelhado na manteiga de ervas.', price: 'R$ 45,00', image: '/images/frango.jpg' },
    { name: 'Parmegiana de Carne', description: 'Bife empanado, coberto com queijo e molho de tomate.', price: 'R$ 55,00', image: '/images/parmegiana.jpg' },
    { name: 'Macarrão ao Pesto', description: 'Massa fresca com molho pesto tradicional e nozes.', price: 'R$ 48,00', image: '/images/macarrao.jpg' },
  ],
  drinks: [
    { name: 'Suco de Laranja', description: '300ml, feito com laranjas frescas.', price: 'R$ 12,00', image: '/images/bar.jpg' },
  ],
  desserts: [
     { name: 'Petit Gâteau', description: 'Bolinho de chocolate com recheio cremoso e sorvete.', price: 'R$ 25,00', image: '/images/carne.jpg' },
  ]
};

type MenuItem = {
    name: string;
    description: string;
    price: string;
    image: string;
}

export default function AdminMenuPage() {
  const [activeTab, setActiveTab] = useState('mainCourses');

  const getTabClass = (tabName: string) => 
    activeTab === tabName 
      ? 'border-b-2 border-black text-black font-semibold' 
      : 'text-gray-500';

  const renderMenuItems = () => {
      let itemsToRender: MenuItem[] = [];
      if (activeTab === 'mainCourses') itemsToRender = menuItems.mainCourses;
      if (activeTab === 'drinks') itemsToRender = menuItems.drinks;
      if (activeTab === 'desserts') itemsToRender = menuItems.desserts;
      
      return itemsToRender.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 my-2">{item.description}</p>
                  <p className="font-semibold">{item.price}</p>
                  <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Editar</button>
                      <button className="flex-1 py-2 text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-50">Excluir</button>
                  </div>
              </div>
          </div>
      ));
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Cardápio</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-semibold">
          <PlusCircle size={20} />
          Adicionar Novo Item
        </button>
      </div>
      
      {/* Abas de Navegação */}
      <div className="flex gap-8 border-b mb-6">
          <button onClick={() => setActiveTab('mainCourses')} className={`py-2 ${getTabClass('mainCourses')}`}>
            Pratos Principais
          </button>
          <button onClick={() => setActiveTab('drinks')} className={`py-2 ${getTabClass('drinks')}`}>
            Bebidas
          </button>
          <button onClick={() => setActiveTab('desserts')} className={`py-2 ${getTabClass('desserts')}`}>
            Sobremesas
          </button>
      </div>

      {/* Grid de Itens do Cardápio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderMenuItems()}
      </div>
    </div>
  );
}
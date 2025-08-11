import React from "react";

export default function LocationCard() {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Localização</h2>
      <img
        src="/images/mapa-sobral.png"
        alt="Mapa de Sobral"
        className="w-full h-auto rounded"
      />
      <p className="mt-2 text-sm text-gray-600">
        Av. Dom José, 100 - Centro, Sobral - CE
      </p>
    </div>
  );
}

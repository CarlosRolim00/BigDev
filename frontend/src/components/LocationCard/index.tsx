import React from "react";

type LocationCardProps = {
  address?: string;
};

export default function LocationCard({ address }: LocationCardProps) {
  const enderecoPadrao = 'Centro, Sobral - CE';
  const endereco = address || enderecoPadrao;
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Localização</h2>
      <div className="w-full h-48 rounded overflow-hidden mb-2">
        <iframe
          title="Mapa do restaurante"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`}
        />
      </div>
      <p className="mt-2 text-sm text-gray-600">{endereco}</p>
    </div>
  );
}

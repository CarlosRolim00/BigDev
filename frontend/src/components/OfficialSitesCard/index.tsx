import React from "react";

export default function OfficialSitesCard() {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-2">Sites Oficiais</h2>
      <ul className="text-sm text-blue-600 space-y-1">
        <li>
          <a href="https://sobral.ce.gov.br" target="_blank" rel="noopener noreferrer">
            Prefeitura de Sobral
          </a>
        </li>
        <li>
          <a href="https://visitesobral.com" target="_blank" rel="noopener noreferrer">
            Visite Sobral
          </a>
        </li>
        <li>
          <a href="https://ifce.edu.br/sobral" target="_blank" rel="noopener noreferrer">
            IFCE - Campus Sobral
          </a>
        </li>
      </ul>
    </div>
  );
}

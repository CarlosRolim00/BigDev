import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importa o plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Apenas o plugin é necessário aqui
  ],
  // GARANTA QUE NÃO HÁ NENHUMA CONFIGURAÇÃO "css: { postcss: ... }" NESTE ARQUIVO.
  // SE HOUVER, APAGUE-A.
})
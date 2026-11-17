import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "./", // rutas relativas: dist/ funciona en cualquier carpeta o subruta
  // El mapa 1:50m (≈750 kB sin comprimir) va dentro del bundle: el aviso de 500 kB no aplica.
  build: { chunkSizeWarningLimit: 1200 },
});

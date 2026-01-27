import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@/components": fileURLToPath(
        new URL("./src/components", import.meta.url),
      ),
      "@/lib": fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: [
            "@headlessui/react",
            "@radix-ui/react-dialog",
            "@radix-ui/react-slot",
            "@radix-ui/react-accordion",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-separator",
          ],
        },
      },
    },
  },
});

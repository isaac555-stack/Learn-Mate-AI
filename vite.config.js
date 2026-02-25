import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "prompt", // This is key! It updates the app automatically.
      manifest: {
        name: "Learn Mate",
        short_name: "Learn Mate",
        description: "AI Study Assistant for WAEC & JAMB",
        theme_color: "#6366F1",
        background_color: "#ffffff",
        display: "standalone", // Makes it look like a real app (no browser bar)
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true, // Allows ngrok to proxy the request
    host: true, // Exposes the server on your local network
    port: 5173, // Ensure this matches your ngrok command
  },
});

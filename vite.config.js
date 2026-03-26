import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true, // Automatically deletes old hashed files
        skipWaiting: true,
        // 1. Clean up the "Cache.put" mess by deleting old versions

        navigateFallback: null,
        clientsClaim: true,
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "PrepFlowMaskable512.png",
      ],
      manifest: {
        name: "PrepFlow",
        short_name: "PrepFlow",
        description: "Advanced AI Study Assistant for JAMB & WAEC",
        theme_color: "#6366F1",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "/PrepFlowIcon192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/PrepFlowIcon512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            // THIS FIXES THE WHITE BOX
            src: "/PrepFlowMaskable512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
});

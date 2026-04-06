import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        navigateFallback: null,
        clientsClaim: true,
        // Optional: Increase the limit slightly to 3MB as a safety net
        maximumFileSizeToCacheInBytes: 3000000,
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
            src: "/PrepFlowMaskable512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  // --- ADDED THIS BUILD SECTION ---
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Grouping heavy AI and UI libs into their own files
          "vendor-ai": ["@google/generative-ai", "@supabase/supabase-js"],
          "vendor-ui": [
            "@mui/material",
            "@emotion/react",
            "@emotion/styled",
            "framer-motion",
          ],
          "vendor-charts": ["mermaid"],
          "vendor-react": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  // --------------------------------
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
});

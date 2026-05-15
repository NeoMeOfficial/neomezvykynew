import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true,
    // Fix SIGKILL crashes - limit file watching
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/database/**',
        '**/public/assets/**',
        '**/*.log'
      ],
      usePolling: false, // Use native file events instead of polling
    },
    // Increase memory allocation
    hmr: {
      overlay: false // Reduce overlay rendering overhead
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      // useRegisterSW (in src/layouts/v2/AppLayout.tsx) handles
      // registration via the React hook — don't also inject a
      // separate <script> registration, or registerSW runs twice.
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'favicon-32.png',
        'favicon-source.svg',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'NeoMe — Wellness pre ženy',
        short_name: 'NeoMe',
        description:
          'Tvoj osobný wellness sprievodca. Cvičenia, výživa, menštruačný cyklus a meditácie.',
        start_url: '/domov-new',
        display: 'standalone',
        background_color: '#F0E6DA',
        theme_color: '#F0E6DA',
        lang: 'sk',
        scope: '/',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize build to reduce memory usage
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  build: {
    // Optimize for better loading performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select'],
          charts: ['recharts'],
          dates: ['date-fns'],
          supabase: ['@supabase/supabase-js'],
        }
      }
    },
    // Use default minifier (esbuild) which is faster and doesn't require terser
    minify: true,
    // Prevent memory issues during build
    chunkSizeWarningLimit: 1000
  },
  // Enable gzip compression for better network performance
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  },
  // Optimize dependency handling
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@supabase/supabase-js'] // Large deps that don't need optimization
  }
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
    minify: true
  },
  // Enable gzip compression for better network performance
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    }
  }
}));

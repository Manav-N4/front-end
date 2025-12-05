import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // 🔥 prevents duplicate React copies (main fix for "Invalid hook call")
  resolve: {
    dedupe: ["react", "react-dom"],
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
})

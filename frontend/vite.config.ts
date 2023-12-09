import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: './src/env',
  server: {
    host: true
  },
  // Vite is trolling hard..
  optimizeDeps: {
    include: ['@mui/material/Tooltip', '@mui/material/Unstable_Grid2', '@mui/icons-material'],
  },
})

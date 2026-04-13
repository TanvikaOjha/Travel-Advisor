import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // You might need to import path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This forces all imports of 'react' to use the one in your root node_modules
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})
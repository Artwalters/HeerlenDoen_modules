import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/HeerlenDoen_modules/' : '/',
  server: {
    port: 3000,
    cors: true, // Belangrijk voor Webflow!
    host: true  // Maakt server toegankelijk op je netwerk
  },
  build: {
    lib: {
      entry: './src/main.js',
      name: 'WebflowApp',
      fileName: 'webflow-app',
      formats: ['iife'] // Immediately Invoked Function Expression voor Webflow
    },
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'main.css'
      }
    }
  }
})
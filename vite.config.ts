import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    manifest: {
      "name": 'Life Review Note',
      "short_name": 'Life Review Note',
      "description": "Life Review Note",
      "theme_color": "#242424",
      // 为了方便，使用svg图标
      icons: [
        {
          "src": "icon.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "icon.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    },

    devOptions: {
      // 如果想在`vite dev`命令下调试PWA, 必须启用它
      enabled: true,
      // Vite在dev模式下会使用浏览器原生的ESModule，将type设置为`"module"`与原先的保持一致
      type: "module"
    },
    registerType: 'autoUpdate',
  })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5174/',
        changeOrigin: true,
        rewrite: (path) => {
          return path
        }
      }
    }
  }
})

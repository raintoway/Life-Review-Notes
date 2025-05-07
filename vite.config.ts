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
    // 添加离线支持
    strategies: 'generateSW',
    workbox: {
      // 缓存所有资源
      globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}'],
      // 离线时导航到新页面也能工作
      navigateFallback: 'index.html',
      // 预缓存资源
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1年
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30天
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
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
    includeAssets: ['favicon.ico', 'robots.txt', 'icon.png'],
  })],
  server: {
    host: '0.0.0.0', // 监听所有地址，使局域网内的设备可以访问
    // proxy: {
    //   '/api': {
    //     target: 'http://cbcq.site:5173/',
    //     changeOrigin: true,
    //     rewrite: (path) => {
    //       return path
    //     }
    //   }
    // }
  }
})

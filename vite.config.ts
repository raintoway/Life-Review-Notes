import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    // host: '0.0.0.0', // 监听所有地址，使局域网内的设备可以访问
    // proxy: {
    //   '/api': {
    //     target: 'http://cbcq.site:5173/',
    //     changeOrigin: true,
    //     rewrite: (path) => {
    //       return path
    //     }
    //   }
    // }
  },
})

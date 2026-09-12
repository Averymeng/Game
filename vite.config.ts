import { defineConfig } from 'vite';

export default defineConfig({
  // 相对路径，方便 GitHub Pages 部署时在子路径下也能访问
  base: './',
  server: {
    port: 5173,
    host: true,
  },
});

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // 相對路徑基底，供 GitHub Pages 專案頁面部署使用
  base: './',
  plugins: [react(), tailwindcss()]
});

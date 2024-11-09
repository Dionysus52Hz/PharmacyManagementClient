import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173, // Thiết lập cổng chạy cho máy chủ Vite (frontend)
        proxy: {
            '/api': {
                // Đường dẫn bắt đầu bằng "/api" sẽ được chuyển tiếp qua proxy
                target: 'http://localhost:3001', // Địa chỉ của máy chủ backend (ở đây là http://localhost:3001)
                changeOrigin: true, // Thay đổi origin của request thành URL của máy chủ backend để tránh lỗi CORS
                secure: false, // Bỏ qua kiểm tra chứng chỉ SSL nếu backend dùng HTTPS nhưng không có chứng chỉ hợp lệ
            },
        },
    },
});

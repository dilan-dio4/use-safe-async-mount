import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        rollupOptions: {
            input: {
                app: "./test/index.html"
            },
        },
        outDir: "test/dist"
    },
    server: {
        open: "/test/"
    },
    base: "/use-safe-async-mount/"
})
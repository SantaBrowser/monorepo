import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
    plugins: [mkcert(), vue(), nodePolyfills({ protocolImports: true })],
    server: {
        https: true,
        host: 'localhost',
        port: 8080,
    },
    resolve: {
        alias: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
        },
    },
    build: {
        outDir: 'build',
        // used for "Graph" is undefined error with Dagre package https://github.com/vitejs/vite/issues/5759
        commonjsOptions: {
            ignoreTryCatch: false,
        },
    },
});

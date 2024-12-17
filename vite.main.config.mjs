import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import viteUnzipPlugin from './vite.unzip.plugin.mjs'
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
    plugins: [
        viteUnzipPlugin({
            zipPath: './assets/laravel.zip',
            outputDir: '.vite/build',
        }),
        viteStaticCopy({
            targets: [
                // {
                //     src: 'phpactor.phar',
                //     dest: '',
                // }
            ],
        }),
    ],
})

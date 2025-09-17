import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        reporters: 'verbose',
        coverage: {
            provider: 'v8',
            reportsDirectory: "./coverage",
            reporter: ['html', 'text'],
            include: ['lib/**'],
            exclude: [
                'node_modules/',
                'tests/',
                'lib/**/*.spec.ts',
                'lib/index.ts',
                'lib/vite-env.d.ts',
                'lib/errors/error.ts',
            ]
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'lib')
        }
    }
});
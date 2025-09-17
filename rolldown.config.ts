import path from "path";
import { defineConfig } from "rolldown";

export default defineConfig([
    {
        input: 'lib/index.ts',
        output: {
            format: 'esm',
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'lib'),
            }
        }
    }
]);
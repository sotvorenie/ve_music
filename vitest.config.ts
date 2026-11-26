import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async () => {
    const resolvedViteConfig = await viteConfig({ command: 'serve', mode: 'test' })

    return mergeConfig(resolvedViteConfig, {
        test: {
            globals: true,
            environment: 'jsdom',
            include: ['src/tests/**/*.{test,spec}.ts'],
            setupFiles: ['./src/tests/setup.ts'],
        },
    })
})
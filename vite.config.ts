import { defineConfig } from 'vite'
import analyzer from 'rollup-plugin-analyzer'
import { dependencies } from './package.json'

export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: 'src/index.ts',
        name: 'hybrids-helpers',
      },
      formats: ['es'],
      rollupOptions: {
        external: [...Object.keys(dependencies || {}).map((pkg) => new RegExp(`^${pkg}(/.*)?`))],
      },
    },
    plugins: [mode === 'analyze' && analyzer({ limit: 100, hideDeps: true })] as any,
    resolve: {
      alias: {
        src: '/src',
      },
    },
    sourceMap: true,
    test: {
      environment: 'happy-dom',
    },
  }
})

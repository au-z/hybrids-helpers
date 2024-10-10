import { defineConfig } from 'vite'
import analyzer from 'rollup-plugin-analyzer'
import { dependencies } from './package.json'
import path from 'path'
const packageDependencies = [...Object.keys(dependencies || {}).map((pkg) => new RegExp(`^${pkg}(/.*)?`))]

export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      minify: false,
      sourcemap: true,
      lib: {
        entry: 'src/index.ts',
        name: 'hybrids-helpers',
      },
      rollupOptions: {
        external: packageDependencies,
      },
    },
    plugins: [mode === 'analyze' && analyzer({ limit: 100, hideDeps: true })] as any,
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
        '@auzmartist/hybrids-helpers': path.resolve(__dirname, 'src/index.ts'),
      },
    },
    test: {
      environment: 'happy-dom',
    },
  }
})

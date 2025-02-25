import { defineConfig, Plugin } from 'rolldown';
import terser from '@rollup/plugin-terser'
import banner from 'rollup-plugin-banner2'
import packageJson from './package.json'


const bannerContent = `
/**
 * @name: ${packageJson.name}
 * @author: ${packageJson.author}
 * @version: ${packageJson.version}
 * @description: ${packageJson.description}
 * @license: ${packageJson.license}
 */`

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      format: 'esm',
      file: './dist/autofit.esm.js',
      name: 'autofit',
      exports: "named",
      esModule: true
    },
    {
      format: 'cjs',
      file: './dist/autofit.cjs.js',
      name: 'autofit',
      exports: "named",
      esModule: true,
    },
    {
      format: 'umd',
      file: './dist/autofit.umd.js',
      exports: "named",
      name: 'autofit',
    },
    {
      format: 'iife',
      file: './dist/autofit.iife.js',
      exports: "named",
      name: 'autofit',
    },
    {
      format: 'iife',
      file: './dist/autofit.min.js',
      exports: "named",
      name: 'autofit',
      plugins: [terser() as Plugin],
    },
  ],
  plugins: [
    banner(() => bannerContent) as Plugin,
  ]
})
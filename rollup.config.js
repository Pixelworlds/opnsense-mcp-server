import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import { dts } from 'rollup-plugin-dts';

export default defineConfig([
  // CLI executable build
  {
    input: 'index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    external: [],
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Library build with all types
  {
    input: 'lib.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    external: [],
    output: [
      {
        file: 'dist/lib.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/lib.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Library type definitions
  {
    input: 'lib.ts',
    plugins: [dts()],
    external: ['@modelcontextprotocol/sdk', '@richard-stovall/opnsense-typescript-client', 'zod'],
    output: {
      file: 'dist/lib.d.ts',
      format: 'es',
    },
  },
  // Source module builds for library usage
  {
    input: 'src/index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
        declarationMap: false,
      }),
    ],
    external: ['@modelcontextprotocol/sdk', '@richard-stovall/opnsense-typescript-client', 'zod'],
    output: [
      {
        file: 'dist/src/index.cjs',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/src/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  // Source type definitions
  {
    input: 'src/index.ts',
    plugins: [dts()],
    external: ['@modelcontextprotocol/sdk', '@richard-stovall/opnsense-typescript-client', 'zod'],
    output: {
      file: 'dist/src/index.d.ts',
      format: 'es',
    },
  },
]);

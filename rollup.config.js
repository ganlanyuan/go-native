// Rollup Plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/go-native.js',
  dest: 'dist/go-native.js',
  format: 'umd',
  sourceMap: 'true',
  moduleName: 'gn',
  plugins: [
    // resolve + commonjs: translate commonjs module to es module
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    eslint({
      exclude: [
        'src/scss/**',
        'src/vendors/**'
      ],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
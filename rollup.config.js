// Plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
  entry: 'src/go-native.js',
  dest: 'dist/go-native.js',
  format: 'umd',
  sourceMap: 'true',
  moduleName: 'gn',
  plugins: [
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
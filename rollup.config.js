import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { string } from 'rollup-plugin-string';
import copy from 'rollup-plugin-copy-glob';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default [{
  input: 'src/main.js',
  context: 'window',
  output: {
    file: 'dist/js/app.js',
    format: 'iife',
    sourcemap: (process.env.NODE_ENV === 'production') ? false : 'inline',
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      plugins: ['transform-custom-element-classes'],
      exclude: 'node_modules/core-js/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: pkg.browserslist,
          },
          useBuiltIns: 'usage',
          modules: false,
          debug: process.env.NODE_ENV === 'production',
        }],
      ],
    }),
    copy([
      { files: 'src/*.{html,css}', dest: 'dist' },
    ], { verbose: true, watch: true }),
    string({
      include: ['**/*.css', '**/*.json'],
    }),
    (process.env.NODE_ENV !== 'production' && serve({ contentBase: ['dist'], open: true, historyApiFallback: true })),
    (process.env.NODE_ENV !== 'production' && livereload({ watch: 'dist' })),
  ],
}];

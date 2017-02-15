const gulp = require('gulp');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');
const eslint = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglifyRollup = require('rollup-plugin-uglify');
const multiEntry = require('rollup-plugin-multi-entry');

const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const path = require('path');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

let sourcemapsDest = 'sourcemaps';
let watch = {
  js: 'tests/js/*.js',
  html: '**/*.html'
};

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

gulp.task('script', function () {
  return rollup({
    entry: 'src/go-native.js',
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
          'src/vendors/**'
        ],
      }),
      buble(),
      // uglifyRollup(),
    ],
    treeshake: false,
    // legacy: true,
  }).then(function (bundle) {
    return bundle.write({
      dest: 'dist/go-native.js',
      format: 'es',
      // moduleName: 'window',
      // sourceMap: 'true',
    })
  })
});

gulp.task('test', function () {
  return rollup({
    entry: 'tests/js/go-native.test.js',
    plugins: [
      // resolve + commonjs: translate commonjs module to es module
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      // commonjs(),
      // eslint({
      //   exclude: [
      //     'src/vendors/**'
      //   ],
      // }),
      // buble(),
      // uglifyRollup(),
    ],
    treeshake: false,
    // legacy: true,
  }).then(function (bundle) {
    return bundle.write({
      dest: 'tests/js/test.min.js',
      format: 'iife',
      moduleName: 'window',
      // sourceMap: 'true',
    })
  })
});

gulp.task('test1', function () {
  return rollup({
    entry: 'c.js',
    treeshake: false,
  }).then(function (bundle) {
    return bundle.write({
      dest: 'bundle.js',
      format: 'es',
    })
  })
});

gulp.task('script-ie8', function () {  
  return gulp.src([
      "bower_components/nwmatcher/src/nwmatcher.js",
      "bower_components/selectivizr_will/selectivizr.js",
      "bower_components/respond/dest/respond.src.js",

      "src/es5/**/*.js",
      "src/ie8/**/*.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat('go-native.ie8.js'))
    .on('error', errorlog)  
    .pipe(gulp.dest('dist'))
    .pipe(rename('go-native.ie8.min.js'))
    .pipe(uglify({
      mangle: false,
      output: {
        quote_keys: true,
      },
      compress: {
        properties: false,
      }
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

// browser-sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    port: '3000',
    open: false,
    notify: false
  });
});

gulp.task('min', function () {
  return gulp.src('dist/go-native.js')
    .pipe(uglify())
    .pipe(rename('go-native.min.js'))
    .pipe(gulp.dest('dist'))
});

// Watch
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['script']).on('change', browserSync.reload);
  gulp.watch('src/**/*.js', ['min']);
  gulp.watch(watch.js).on('change', browserSync.reload);
  gulp.watch(watch.html).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', [
  'browserSync', 
  'watch', 
  'script',
  // 'script-ie8',
  'min',
  // 'test1'
]);  
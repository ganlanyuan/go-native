const gulp = require('gulp');
const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');
const eslint = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const multiEntry = require('rollup-plugin-multi-entry');

const browserSync = require('browser-sync').create();
// const rename = require('gulp-rename');
// const mergeStream = require('merge-stream');

let config = {
  sourcemaps: 'sourcemaps',

  watch: {
    js: 'tests/js/*.js',
    html: '**/*.html'
  },

  js: {
    src: [
      [
        "bower_components/requestAnimationFrame/requestAnimationFrame.js",
        "bower_components/Units/Length.js",
        "bower_components/domtokenlist/src/token-list.js",

        "src/utilities/*.js",
        
        "src/gn/base.js",
        "src/gn/isNodeList.js",
        "src/gn/*.js",
      ],
      [
        "bower_components/nwmatcher/src/nwmatcher.js",
        "bower_components/selectivizr_will/selectivizr.js",
        "bower_components/respond/dest/respond.src.js",

        "src/es5/*.js",
        "src/ie8/*.js"
      ],
    ],
    name: ['go-native.js', 'go-native.ie8.js'],
    options:[{}, {
        mangle: false,
        output: {
          quote_keys: true,
        },
        compress: {
          properties: false,
        }
      }
    ],
    dest: 'dist',
  },
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
      // eslint({
      //   exclude: [
      //     'src/vendors/**'
      //   ],
      // }),
      // buble(),
      // uglify(),
    ],
    // legacy: true,
  }).then(function (bundle) {
    return bundle.write({
      dest: 'dist/go-native.js',
      format: 'iife',
      moduleName: 'window',
      sourceMap: 'true',
      // exports: 'none',
    })
  })
});

gulp.task('script-ie8', function () {
  return rollup({
    entry: [
      "bower_components/nwmatcher/src/nwmatcher.js",
      "bower_components/selectivizr_will/selectivizr.js",
      "bower_components/respond/dest/respond.src.js",

      "src/es5/**/*.js",
      "src/ie8/**/*.js"
    ],
    plugins: [
      multiEntry(),
      // resolve + commonjs: translate commonjs module to es module
      // resolve({
      //   jsnext: true,
      //   main: true,
      //   browser: true,
      // }),
      // commonjs(),
      // eslint(),
      // buble(),
      // uglify(),
    ],
    legacy: true,
  }).then(function (bundle) {
    return bundle.write({
      dest: 'dist/go-native.ie8.js',
      // format: 'iife',
      // moduleName: 'window',
    })
  })
});

// JS Task  
gulp.task('js', function () {  
  let tasks = [], 
      srcs = config.js.src,
      names = config.js.name;
      
  return gulp.src([
      "bower_components/nwmatcher/src/nwmatcher.js",
      "bower_components/selectivizr_will/selectivizr.js",
      "bower_components/respond/dest/respond.src.js",

      "src/es5/*.js",
      "src/ie8/*.js"
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
    .pipe(sourcemaps.write(config.sourcemaps))
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

// Watch
gulp.task('watch', function () {
  gulp.watch('src/**/*.js', ['script']).on('change', browserSync.reload);
  gulp.watch(config.watch.js).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', [
  // 'js_min',
  'browserSync', 
  'script',
  'script-ie8',
  // 'watch', 
]);  
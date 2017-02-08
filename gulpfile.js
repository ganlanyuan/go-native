const gulp = require('gulp');
const babel = require("gulp-babel");
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const path = require('path');
const inject = require('gulp-inject');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');

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
  gulp.watch('src/**/*.js', ['js']).on('change', browserSync.reload);
  gulp.watch(config.watch.js).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
});

// JS Task  
gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(concat('all.js'))
    // .pipe(gulp.dest('dist'))
    // .pipe(rename())
    // .pipe(uglify(config.js.options[i]))
    // .pipe(sourcemaps.write(config.sourcemaps))
    .pipe(gulp.dest('dist'));
});
// gulp.task('js', function () {  
//   let tasks = [], 
//       srcs = config.js.src,
//       names = config.js.name;
      
//   for (let i = 0; i < srcs.length; i++) {
//     tasks.push(
//       gulp.src(srcs[i])
//           .pipe(sourcemaps.init())
//           .pipe(jshint())
//           .pipe(jshint.reporter(stylish))
//           .pipe(concat(names[i]))
//           .on('error', errorlog)  
//           .pipe(gulp.dest(config.js.dest))
//           .pipe(rename(names[i].replace('.js', '.min.js')))
//           .pipe(uglify(config.js.options[i]))
//           .pipe(sourcemaps.write(config.sourcemaps))
//           .pipe(gulp.dest(config.js.dest))
//     );
//   }

//   return mergeStream(tasks)
//       .pipe(browserSync.stream());
// });

// Default Task
gulp.task('default', [
  // 'js_min',
  'js',
  'browserSync', 
  'watch', 
]);  
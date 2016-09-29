var config = {
  sassLang: 'libsass',
  sourcemaps: 'sourcemaps',
  browserSync: {
    server: {
      baseDir: './'
    },
    port: '3000',
    open: true,
    notify: false
  },

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

var gulp = require('gulp');
var php = require('gulp-connect-php');
var libsass = require('gulp-sass');
var rubysass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var path = require('path');
var svgmin = require('gulp-svgmin');
var svg2png = require('gulp-svg2png');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// browser-sync
gulp.task('sync', function() {
  browserSync.init(config.browserSync);
});

// Watch
gulp.task('watch', function () {
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.watch.js).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
});

// JS Task  
gulp.task('js', function () {  
  var tasks = [], 
      srcs = config.js.src,
      names = config.js.name;
      
  for (var i = 0; i < srcs.length; i++) {
    tasks.push(
      gulp.src(srcs[i])
          .pipe(sourcemaps.init())
          .pipe(jshint())
          .pipe(jshint.reporter(stylish))
          .pipe(concat(names[i]))
          .on('error', errorlog)  
          .pipe(gulp.dest(config.js.dest))
          .pipe(rename(names[i].replace('.js', '.min.js')))
          .pipe(uglify(config.js.options[i]))
          .pipe(sourcemaps.write(config.sourcemaps))
          .pipe(gulp.dest(config.js.dest))
    );
  }

  return mergeStream(tasks)
      .pipe(browserSync.stream());
});

// Default Task
gulp.task('default', [
  // 'js_min',
  'js',
  'sync', 
  'watch', 
]);  
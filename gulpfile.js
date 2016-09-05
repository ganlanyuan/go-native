var config = {
  sassLang: 'libsass',
  map_dest: 'sourcemap',
  
  browserSync: {
    server: {
      baseDir: './'
    },
    port: '3000',
    open: true,
    notify: false
  },

  watch: {
    js: ['src/**/*.js', 'tests/js/*.js'],
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
        "bower_components/selectivizr-update/selectivizr.js",
        "bower_components/respond/dest/respond.src.js",
        "bower_components/html5shiv/dist/html5shiv.js",

        "src/es5/*.js",
        "src/ie8/*.js"
      ],
    ],
    name: ['go-native.js', 'go-native.ie8.js'],
    dest: 'dist',
  },
};

var gulp = require('gulp');
var php = require('gulp-connect-php');
var sass;
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
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
gulp.task('browser-sync', function() {
  browserSync.init(config.browserSync);
});

// Watch
gulp.task('watch', function () {
  gulp.watch(config.watch.js, ['js_min']);
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
          .pipe(concat(names[i]))
          .on('error', errorlog)  
          .pipe(gulp.dest(config.js.dest))
    );
  }

  return mergeStream(tasks)
      .pipe(browserSync.stream());
});

gulp.task('js_min',  function () {
  var tasks = [],
      name = config.js.name;
      
  for (var i = 0; i < name.length; i++) {
    tasks.push(
      gulp.src(config.js.dest + '/' + name[i])
          .pipe(sourcemaps.init())
          .pipe(uglify())
          .pipe(rename(function (path) {
            path.basename += '.min';
          }))
          .pipe(sourcemaps.write(config.map_dest))
          .pipe(gulp.dest(config.js.dest))
    );
  }

  return mergeStream(tasks);
});

// Default Task
gulp.task('default', [
  'browser-sync', 
  'js_min',
  'watch', 
]);  
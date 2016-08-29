var gulp = require('gulp'),
    php = require('gulp-connect-php'),
    sass,
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    svgstore = require('gulp-svgstore'),
    path = require('path'),
    svgmin = require('gulp-svgmin'),
    svgfallback = require('gulp-svgfallback'),
    svg2png = require('gulp-svg2png'),
    inject = require('gulp-inject'),
    browserSync = require('browser-sync').create(),
    rename = require('gulp-rename'),
    config = require('./gulp-config.js');

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// browser-sync
gulp.task('browser-sync', ['js'], function() {
  browserSync.init(config.browserSync);

  gulp.watch(config.watch.js, ['js']);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
});

// JS Task  
gulp.task('gn', function () {  
  return gulp.src(config.gn)
    .pipe(concat('go-native.js'))
    .on('error', errorlog)  
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});  

gulp.task('gn-min', function () {  
  return gulp.src(config.dest + '/go-native.js')
    .pipe(sourcemaps.init())
    .pipe(rename('go-native.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write(config.mapdest))
    .on('error', errorlog)  
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});  

gulp.task('gnie8', function () {  
  return gulp.src(config.gnie8)
    .pipe(concat('go-native.ie8.js'))
    .on('error', errorlog)  
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});  

gulp.task('gnie8-min', function () {  
  return gulp.src(config.dest + '/go-native.ie8.js')
    .pipe(sourcemaps.init())
    .pipe(rename('go-native.ie8.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write(config.mapdest))
    .on('error', errorlog)  
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});  

// js tasks
gulp.task('js', [
  'gn', 
  'gn-min', 
  'gnie8', 
  'gnie8-min', 
]);  

// Default Task
gulp.task('default', [
  'browser-sync', 
  'js', 
]);  
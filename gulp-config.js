module.exports = {
  sassLang: 'libsass',
  
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

  gn: [
    "./bower_components/requestAnimationFrame/requestAnimationFrame.js",
    "./bower_components/Units/Length.js",
    "./bower_components/domtokenlist/src/token-list.js",

    "src/utilities/*.js",
    
    "src/gn/base.js",
    "src/gn/isNodeList.js",
    "src/gn/*.js",
  ],

  gnie8: [
    "./bower_components/nwmatcher/src/nwmatcher.js",
    "./bower_components/Selectivizr-bower/selectivizr.js",
    "./bower_components/respond/dest/respond.src.js",
    "./bower_components/html5shiv/dist/html5shiv.js",

    "src/es5/*.js",
    "src/ie8/*.js"
  ],

  dest: 'dist',
  mapdest: 'sourcemap',
};
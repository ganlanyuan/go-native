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
    "src/utilities/*.js",
    "./bower_components/domtokenlist/src/token-list.js",

    "src/gn/base.js",
    "src/gn/dom.ready.js",
    "src/gn/optimizedResize.js",
    "src/gn/extend.js",

    "src/gn/getSupportedProp.js",
    "src/gn/getOffsetLeft.js",
    "src/gn/getOffsetTop.js",

    "src/gn/getOuterWidth.js",
    "src/gn/getOuterHeight.js",

    "src/gn/getClosest.js",
    "src/gn/getParents.js",
    "src/gn/getParentsUntil.js",
    "src/gn/getSiblings.js",

    "src/gn/isInViewport.js",
    "src/gn/indexOf.js",
    "src/gn/createElement.js",

    "src/gn/isNodeList.js",
    "src/gn/append.js",
    "src/gn/prepend.js",
    "src/gn/wrap.js",
    "src/gn/wrapAll.js",
    "src/gn/unwrap.js",
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
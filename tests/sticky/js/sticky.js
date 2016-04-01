// sticky({sticky: '.sticky', container: '.container', padding: '.header'});
// sticky({sticky: '.sticky', container: '.container', padding: 20});

/**
  * sticky 
  * 
  * DEPENDENCIES:
  *
  * == IE8 ==
  *
  * == all ==
  * requestAnimationFrame
  * optimizedResize
  * extend
  */

;(function (stickyJS) {
  window.sticky = stickyJS();
})(function () {
  'use strict';

  function sticky (options) {
    var stickyEls = document.querySelectorAll(options.sticky);

    if (stickyEls.length === 0) { 
      console.log('"' + options.nav + '" can\'t be found.'); 
      return;
    }

    for (var i = stickyEls.length; i--;) {
      var newOptions = options;
      newOptions.sticky = stickyEls[i];

      var a = new stickyCore(newOptions);
    }
  }

  function stickyCore (options) {
    options = gn.extend({ 
      sticky: document.querySelector('.sticky'),
      container: false,
      padding: 0,
      position: 'top',
      breakpoints: false,
    }, options || {});

    // set container, padding, position
    var doc = document;
    var bp = options.breakpoints;
    var sticky = options.sticky;
    var stickyClassNames = sticky.className;
    var parent = sticky.parentNode;
    var container = (options.container) ? doc.querySelector(options.container) : false;
    var padding = (typeof options.padding === 'number') ? options.padding : gn.getOuterHeight(doc.querySelector(options.padding));
    var position = options.position;
    this.stickyHeight = gn.getOuterHeight(sticky);

    // var run = false, bp1, bp2, winST, winW, winH, stkOT, stkW, stkH, newStkW, newStkH, containerOT, containerH;
    var windowWidth;
    var initialized = false;
    var inRange = false;
    var scrollInitialized = false;
    var fixedBreakpoint = false;
    var absoluteBreakpoint = false;

    this.init = function () {
      this.jsWrapper = document.createElement('div');
      this.jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, this.jsWrapper);
      initialized = true;
      console.log('initialized');
    };

    this.destory = function () {
      sticky.className = stickyClassNames;
      sticky.style.width = '';
      sticky.style[position] = '';
      gn.unwrap(this.jsWrapper);
      initialized = false;
      console.log('destoried');
    };

    this.checkRange = (function () {
      if (!bp) {
        return function () { return true; };
      } else if (typeof bp === 'number') {
        return function () { return windowWidth >= bp; };
      } else if (Array.isArray(bp)) {
        switch (bp.length) {
          case 2:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1]; };
            break;
          case 3:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1] || windowWidth >= bp[2]; };
            break;
          default:
            return function () { return windowWidth >= bp[0] && windowWidth < bp[1] || windowWidth >= bp[2] && windowWidth < bp[3]; };
        }
      }
    })();

    this.onLoad = function () {
      windowWidth = window.innerWidth;
      inRange = this.checkRange();

      if (inRange && !initialized) {
        this.init();
      } else if (!inRange && initialized) {
        this.destory();
      }

    };

    this.checkPosition = function () {
      this.stickyHeight = gn.getOuterHeight(sticky);
      this.windowHeight = window.innerHeight;
      return (this.stickyHeight > this.windowHeight)? 'bottom' : position;
    };

    this.getFixedBreakpoint = function () {
      if (position === 'top') {
        return padding;
      } else {
        return this.windowHeight - this.stickyHeight - padding;
      }
    };

    this.getAbsoluteBreakpoint = function () {
      if (!container) {
        return false;
      } else {
        this.containerHeight = gn.getOuterHeight(container);

        if (position === 'top') {
          return this.containerHeight - this.stickyHeight - padding;
        } else {
          return this.windowHeight + padding - this.containerHeight;
        }
      }
    };

    this.isNormal = function () {
      sticky.classList.remove('js-fixed-' + position);
      sticky.style.width = '';
      container.style.height = '';
    };

    this.isFixed = function () {
      if (!sticky.classList.contains('js-fixed-' + position)) {
        container.classList.remove('js-relative');
        sticky.classList.add('js-fixed-' + position);
        sticky.classList.remove('js-absolute-' + position);
      }
    };

    this.isAbsolute = function () {
      if (!sticky.classList.contains('js-absolute-' + position)) {
        container.classList.add('js-relative');
        sticky.classList.add('js-absolute-' + position);
        sticky.classList.remove('js-fixed-' + position);
      }
    };

    this.onScroll = function () {
      if (!scrollInitialized) {
        var style = window.getComputedStyle(sticky),
            pattern = /\d/, // check if value contains digital number
            left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
            right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight));

        this.stickyWidth = gn.getOuterWidth(this.jsWrapper - left - right);
        position = this.checkPosition();
        fixedBreakpoint = this.getFixedBreakpoint();
        absoluteBreakpoint = this.getAbsoluteBreakpoint();

        scrollInitialized = true;
      } 

      var stickyRectTop = this.jsWrapper.getBoundingClientRect().top;
      if (stickyRectTop > fixedBreakpoint) {
        this.isNormal();
      } else {
        if (!absoluteBreakpoint) {
          if (stickyRectTop <= fixedBreakpoint) {
            this.isFixed();
          }
        } else {
          var containerRectTop = container.getBoundingClientRect().top;
          
          if (stickyRectTop <= fixedBreakpoint && containerRectTop > absoluteBreakpoint) {
            this.isFixed();
          } else {
            this.isAbsolute();
          }
          
        }
      }
    };

    var that = this;
    window.addEventListener('load', function () { 
      that.onLoad(); 
    });
    gn.optimizedResize.add(function () { 
      that.onLoad(); 
    });
    window.addEventListener('scroll', function () { 
      // that.onScroll(); 
    });
  }

  return sticky;
});
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
    var stickyWidth;
    var jsWrapper;
    var initialized = false;
    var isSticky = false;
    var fixed = false;
    var absolute = false;

    var inRange = false;
    var fixedBreakpoint = false;
    var absoluteBreakpoint = false;

    this.init = function () {
      // wrap sticky
      jsWrapper = document.createElement('div');
      jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, jsWrapper);

      // set position, fixedBreakpoint & absoluteBreakpoint
      stickyWidth = this.getStickyWidth();
      this.stickyHeight = gn.getOuterHeight(sticky);
      this.windowHeight = window.innerHeight;
      fixedBreakpoint = this.getFixedBreakpoint();
      absoluteBreakpoint = this.getAbsoluteBreakpoint();

      initialized = true;
    };

    this.destory = function () {
      sticky.className = stickyClassNames;
      sticky.style.width = '';
      sticky.style[position] = '';
      gn.unwrap(jsWrapper);
      initialized = false;
      isSticky = false;
      fixed = false;
      absolute = false;
      inRange = false;
    };

    this.getStickyWidth = function () {
      var style = window.getComputedStyle(sticky),
          pattern = /\d/, // check if value contains digital number
          left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
          right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight));

      return jsWrapper.clientWidth - left - right;
    };

    this.getFixedBreakpoint = function () {
      position = (this.stickyHeight > this.windowHeight)? 'bottom' : position;

      if (position === 'top') {
        return padding;
      } else {
        return this.windowHeight - this.stickyHeight - padding;
      }
    };

    this.getAbsoluteBreakpoint = (function () {
      if (!container) {
        return function () { return false; };
      } else {
        return function () {
          this.containerHeight = gn.getOuterHeight(container);

          if (position === 'top') {
            return this.containerHeight - this.stickyHeight - padding;
          } else {
            return this.windowHeight + padding - this.containerHeight;
          }
        };
      }
    })();

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

    this.onResize = function () {
      this.onLoad();
      stickyWidth = this.getStickyWidth();

      if (initialized) {
        if (isSticky) {
          sticky.style.width = stickyWidth + 'px';
        }
        this.onScroll();
      }
    }

    this.isNormal = function () {
      sticky.classList.remove('js-fixed-' + position, 'js-sticky');
    };

    this.isFixed = function () {
      if (!sticky.classList.contains('js-fixed-' + position)) {
        container.classList.remove('js-relative');
        sticky.classList.add('js-fixed-' + position, 'js-sticky');
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
      var stickyRectTop = jsWrapper.getBoundingClientRect().top;
      if (stickyRectTop > fixedBreakpoint) {
        if (isSticky) {
          this.isNormal();
          sticky.style.width = '';
          sticky.style[position] = '';
          isSticky = false;
          fixed = false;
          absolute = false;
        }
      } else {
        if (!isSticky) {
          sticky.style.width = stickyWidth + 'px';

          sticky.style[position] = padding + 'px';
          isSticky = true;
        }
        if (container) {
          var containerRectTop = container.getBoundingClientRect().top;
          if (!fixed && stickyRectTop <= fixedBreakpoint && containerRectTop > absoluteBreakpoint) {
            this.isFixed();
            fixed = true;
            absolute = false;
          } else if (!absolute && containerRectTop <= absoluteBreakpoint) {
            this.isAbsolute();
            fixed = false;
            absolute = true;
          }
        } else {
          if (!fixed && stickyRectTop <= fixedBreakpoint) {
            this.isFixed();
            sticky.style.width = stickyWidth + 'px';

            sticky.style[position] = padding + 'px';
            fixed = true;
          }
        }
      }
    };

    var that = this;
    window.addEventListener('load', function () { 
      that.onLoad(); 
    });
    gn.optimizedResize.add(function () { 
      that.onResize(); 
    });
    window.addEventListener('scroll', function () { 
      if (initialized) {
        that.onScroll(); 
      }
    });
  }

  return sticky;
});
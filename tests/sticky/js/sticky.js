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

    var
        d = document,
        bp = options.breakpoints,
        sticky = options.sticky,
        stickyClassNames = sticky.className,
        parent = sticky.parentNode,
        container = (options.container) ? d.querySelector(options.container) : false,
        padding = (typeof options.padding === 'number') ? options.padding : gn.getOuterHeight(d.querySelector(options.padding)),
        position = options.position;

    var 
        jsWrapper,
        windowWidth,
        windowHeight,
        stickyWidth,
        stickyHeight,
        containerHeight,
        fixedBreakpoint,
        absoluteBreakpoint,

        inRange = false,
        initialized = false,
        isSticky = false,
        fixed = false,
        absolute = false;

    this.init = function () {
      // wrap sticky
      jsWrapper = document.createElement('div');
      jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, jsWrapper);

      initialized = true;
    };

    this.updateSizes = function () {
      // update sizes, position and breakpoints
      stickyWidth = this.getStickyWidth();
      stickyHeight = gn.getOuterHeight(sticky);
      containerHeight = gn.getOuterHeight(container);
      windowHeight = window.innerHeight;

      position = this.getPosition();
      fixedBreakpoint = this.getFixedBreakpoint();
      absoluteBreakpoint = this.getAbsoluteBreakpoint();
    };

    this.destory = function () {
      sticky.className = stickyClassNames;
      sticky.style.width = '';
      sticky.style[position] = '';
      gn.unwrap(jsWrapper);

      inRange = false;
      initialized = false;
      isSticky = false;
      fixed = false;
      absolute = false;
    };

    this.getStickyWidth = function () {
      var style = window.getComputedStyle(sticky),
          pattern = /\d/, // check if value contains digital number
          left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
          right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight));

      return jsWrapper.clientWidth - left - right;
    };

    this.getPosition = function () {
      return (stickyHeight > windowHeight)? 'bottom' : position;
    };
    
    this.getFixedBreakpoint = function () {

      if (position === 'top') {
        return padding;
      } else {
        return windowHeight - stickyHeight - padding;
      }
    };

    this.getAbsoluteBreakpoint = (function () {
      if (!container) {
        return function () { return false; };
      } else {
        return function () {
          if (position === 'top') {
            return containerHeight - stickyHeight - padding;
          } else {
            return windowHeight + padding - containerHeight;
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
        this.updateSizes();
      } else if (!inRange && initialized) {
        this.destory();
      }
    };

    this.onResize = function () {
      this.onLoad();
      this.updateSizes();

      if (initialized) {
        if (isSticky) { sticky.style.width = stickyWidth + 'px'; }
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
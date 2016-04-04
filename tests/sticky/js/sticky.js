/**
  * sticky 
  * 
  * DEPENDENCIES:
  *
  * == IE8 ==
  * html5shiv
  * ES5-arrays
  * addEventListener
  * window.getComputedStyle
  * window.innerHeight
  *
  * == all ==
  * Array.isArray
  * classList
  * requestAnimationFrame
  * optimizedResize
  * extend
  * Length
  * isNodeList
  * wrap
  * unwrap
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

    // basic variables
    var
        bp = options.breakpoints,
        sticky = options.sticky,
        stickyClassNames = sticky.className,
        container = (options.container) ? document.querySelector(options.container) : false,
        padding = options.padding,
        position = options.position;

    // global variables:
    // sticky, container and window sizes
    // ticking variables
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
        absolute = false,

        stickyRectTop = 0,
        containerRectTop = false,
        ticking = false;

    // init: 
    // wrap sticky with a new <div>
    // to track sticky width and scrollTop
    this.init = function () {
      jsWrapper = document.createElement('div');
      jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, jsWrapper);

      initialized = true;
    };

    // update sizes:
    // get sticky, container and window information to calculate
    // two breakpoints: pinned to window / follow container
    // 
    // do this on document load & window resize
    this.updateSizes = function () {
      var style = window.getComputedStyle(sticky),
          pattern = /\d/, // check if value contains digital number
          left = (pattern.exec(style.marginLeft) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginLeft)),
          right = (pattern.exec(style.marginRight) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginRight)),
          top = (pattern.exec(style.marginTop) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginTop)),
          bottom = (pattern.exec(style.marginBottom) === null) ? 0 : parseInt(Length.toPx(sticky, style.marginBottom));

      // update sizes, position and breakpoints
      stickyWidth = jsWrapper.clientWidth - left - right;;
      stickyHeight = sticky.offsetHeight + top + bottom;
      if (container) { containerHeight = container.clientHeight; }
      windowHeight = window.innerHeight;

      position = this.getPosition();
      fixedBreakpoint = this.getFixedBreakpoint();
      absoluteBreakpoint = this.getAbsoluteBreakpoint();
    };

    // destory:
    // restore everything when window size is not in the range
    // remove inserted <div>, classnames, styles and initialize ticking variables
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

    // check if the window size is in the range
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

    // check if sticky is longer than window height
    // if so, set position to bottom
    this.getPosition = function () {
      return (stickyHeight > windowHeight)? 'bottom' : position;
    };
    
    // get pinned / fixed breakpoint
    // based on sticky scrollTop (getBoundingClientRect().top)
    this.getFixedBreakpoint = function () {
      if (position === 'top') {
        return padding;
      } else {
        return windowHeight - stickyHeight - padding;
      }
    };

    // get followed / absolute breakpoint
    // based on container scrollTop (getBoundingClientRect().top)
    this.getAbsoluteBreakpoint = (function () {
      if (!container) {
        return function () { return false; };
      } else {
        return function () {
          if (position === 'top') {
            return  stickyHeight + padding - containerHeight;
          } else {
            return windowHeight - containerHeight;
          }
        };
      }
    })();

    // onload:
    // check if the window is in the range
    // if so, wrap sticky with new <div> and store size information
    // otherwise，unwrap <div> and initialize variables
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

    // onresize:
    // same things with onload, but always need to chase size information to update sticky status,
    // and update sticky width while it's pinned or following
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
        sticky.classList.add('js-fixed-' + position, 'js-sticky');
        sticky.classList.remove('js-absolute');
        if (container) {
          container.classList.remove('js-relative');
        }
      }
    };

    this.isAbsolute = function () {
      if (!sticky.classList.contains('js-absolute')) {
        container.classList.add('js-relative');
        sticky.classList.add('js-absolute');
        sticky.classList.remove('js-fixed-' + position);
      }
    };

    // onscroll:
    // change sticky status based on sticky / container scrollTop
    // the adventage of using getBoundingClientRect().top instead of offsetTop is that the sticky will not be affected by other element's height changing while scrolling
    // e.g. when window scroll down, the header become fixed positioned, thus height property become 0
    this.onScroll = function () {
      if (stickyRectTop > fixedBreakpoint) {
        if (isSticky) {
          this.isNormal();
          sticky.style.width = '';
          sticky.style.top = '';
          sticky.style.bottom = '';
          jsWrapper.style.height = '';
          isSticky = false;
          fixed = false;
          absolute = false;
        }
      } else {
        if (!isSticky) {
          sticky.style.width = stickyWidth + 'px';
          jsWrapper.style.height = stickyHeight + 'px';
          isSticky = true;
        }

        if (container) {
          if (!fixed && stickyRectTop <= fixedBreakpoint && containerRectTop > absoluteBreakpoint) {
            this.isFixed();
            sticky.style[position] = padding + 'px';
            if (position === 'top') {
              sticky.style.bottom = '';
            }
            fixed = true;
            absolute = false;
          } else if (!absolute && containerRectTop <= absoluteBreakpoint) {
            this.isAbsolute();
            sticky.style.top = '';
            if (position === 'top') {
              sticky.style.bottom = '0px';
            }
            fixed = false;
            absolute = true;
          }
        } else {
          if (!fixed && stickyRectTop <= fixedBreakpoint) {
            this.isFixed();
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
      stickyRectTop = jsWrapper.getBoundingClientRect().top;
      if (container) {
        containerRectTop = container.getBoundingClientRect().top;
      }
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (initialized) {
            that.onScroll(); 
          }
          ticking = false;
        });
      }
      ticking = true;
    });
  }

  return sticky;
});
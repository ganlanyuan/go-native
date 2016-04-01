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

    var initialized = false;
    var inRange = false;
    var scrolling = false;
    var fixedBreakpoint = false;
    var absoluteBreakpoint = false;

    this.init = function () {
      this.jsWrapper = document.createElement('div');
      this.jsWrapper.className = 'js-sticky-wrapper';
      gn.wrap(sticky, this.jsWrapper);
      initialized = true;
    };

    this.destory = function () {
      sticky.className = stickyClassNames;
      sticky.style.width = '';
      sticky.style[position] = '';
      gn.unwrap(this.jsWrapper);
      initialized = false;
    };

    this.checkRange = (function () {
      if (!bp) {
        return function () { return true; };
      } else if (typeof bp === 'number') {
        return function () { return this.windowWidth >= bp; };
      } else if (Array.isArray(bp)) {
        switch (bp.length) {
          case 2:
            return function () { return this.windowWidth >= bp[0] && this.windowWidth < bp[1]; };
            break;
          case 3:
            return function () { return this.windowWidth >= bp[0] && this.windowWidth < bp[1] || this.windowWidth >= bp[2]; };
            break;
          default:
            return function () { return this.windowWidth >= bp[0] && this.windowWidth < bp[1] || this.windowWidth >= bp[2] && this.windowWidth < bp[3]; };
        }
      }
    })();

    this.onLoad = function () {
      this.stickyOffsetTop = gn.getOffsetTop(this.sticky);
      this.windowWidth = window.innerWidth;
      inRange = this.checkRange();

      if (inRange && !initialized) {
        this.init();
      } else if (!inRange && initialized) {
        this.destory();
      }
    };

    this.checkPosition = function () {
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

    this.onNormal = function () {
      sticky.classList.remove('js-fixed-' + position);
      sticky.style.width = '';
      container.style.height = '';
    };

    this.onFixed = function () {
      if (!sticky.classList.contains('js-fixed-' + position)) {
        container.classList.remove('js-relative');
        sticky.classList.add('js-fixed-' + position);
        sticky.classList.remove('js-absolute-' + position);
      }
    };

    this.onAbsolute = function () {
      if (!sticky.classList.contains('js-absolute-' + position)) {
        container.classList.add('js-relative');
        sticky.classList.add('js-absolute-' + position);
        sticky.classList.remove('js-fixed-' + position);
      }
    };

    this.onScroll = function () {
      if (!scrolling) {
        this.stickyHeight = gn.getOuterHeight(sticky);
        position = this.checkPosition();

        fixedBreakpoint = this.getFixedBreakpoint();
        absoluteBreakpoint = this.getAbsoluteBreakpoint();

        scrolling = true;
      } 
      // console.log(fixedBreakpoint, absoluteBreakpoint);
      var stickyRectTop = this.jsWrapper.getBoundingClientRect().top;
      if (stickyRectTop > fixedBreakpoint) {
        this.onNormal();
      } else {
        if (!absoluteBreakpoint) {
          if (stickyRectTop <= fixedBreakpoint) {
            this.onFixed();
          }
        } else {
          var containerRectTop = container.getBoundingClientRect().top;
          
          if (stickyRectTop <= fixedBreakpoint && containerRectTop > absoluteBreakpoint) {
            this.onFixed();
          } else {
            this.onAbsolute();
          }
          
        }
      }
    };

    // on init and resize: get and set sticky, parent sizes
    var init = function () {
      winST = window.pageYOffset;
      winW = window.innerWidth;
      winH = window.innerHeight;
      stkOT = gn.getOffsetTop(parent);
      stkW = gn.getOuterWidth(sticky);
      stkH = gn.getOuterHeight(parent);
      newStkW = gn.getOuterWidth(parent);
      newStkH = gn.getOuterHeight(sticky);

      // set window breakpoints
      if (!bp) {
        run = true;
      } else if (typeof bp === 'number') {
        if (winW >= bp) {
          run = true;
        } else {
          run = false;
        }
      } else if (Array.isArray(bp)) {
        if (winW >= bp[0] && winW < bp[1]) {
          run = true;
        } else {
          run = false;
        }
      }

      if (container) {
        containerOT = gn.getOffsetTop(container);
        containerH = gn.getOuterHeight(container);
      }


      if (position === 'bottom' || (stkH + padding) > winH) {
        bp1 = (stkOT + stkH + padding) - winH;
        if (container) {
          bp2 = (containerOT + containerH + padding) - winH;
        }
      } else {
        bp1 = stkOT - padding;
        if (container) {
          bp2 = (containerOT + containerH) - (stkH + padding);
        }
      }

      if (winST > bp1 && run) {
        if (newStkW !== stkW) {
          stkW = newStkW;
          sticky.css({
            'width': stkW + 'px',
            'box-sizing': 'border-box',
            'margin-top': '0px',
            'margin-bottom': '0px',
          });
        }
        if (newStkH !== stkH) {
          stkH = newStkH;
          parent.css('height', stkH + 'px');
        }
      } else {
        sticky.css({
          'position': '',
          'width': '',
          'box-sizing': '',
          'top': '',
          'bottom': '',
          'margin-top': '',
          'margin-bottom': '',
        });
        parent.css('height', '');

        if (container) { container.css('position', ''); }
      }

      return run, bp1, bp2, stkW, stkH;
    }


    // on scroll: update sticky status
    var onScroll = function () { 
      winST = window.pageYOffset;

      // set position
      if (!container) {
        if (winST > bp1 && run) {
          if (sticky.style.position !== 'fixed') {
            sticky.css('position', 'fixed').addClass('js-is-sticky');

            if (position === 'bottom' || (stkH + padding) > winH) {
              sticky.css('bottom', padding + 'px');
            } else {
              sticky.css('top', padding + 'px');
            }
          }
        } else {
          if (sticky.style.position) {
            sticky.css('position', '').removeClass('js-is-sticky');

            if (position === 'bottom' || (stkH + padding) > winH) {
              sticky.css('bottom', '');
            } else {
              sticky.css('top', '');
            }
          }
        }
      } else {
        if (winST > bp1 && winST <= bp2 && run) {
          if (sticky.style.position !== 'fixed') {
            container.css('position', '');
            sticky.css('position', 'fixed').addClass('js-is-sticky').removeClass('js-is-following');

            if (position === 'bottom' || (stkH + padding) > winH) {
              sticky.css({
                'bottom': padding + 'px',
                'top': '',
              });
            } else {
              sticky.css({
                'top': padding + 'px',
                'bottom': '',
              });
            }
          }
        } else if (winST > bp2 && run){
          if (sticky.style.position !== 'absolute') {
            container.css('position', 'relative');
            sticky.css({
              'position': 'absolute',
              'top': '',
            }).removeClass('js-is-sticky').addClass('js-is-following');

            if (position === 'bottom' || (stkH + padding) > winH) {
              sticky.css('bottom', padding + 'px');
            } else {
              sticky.css('bottom', '0px');
            }
          }
        } else {
          if (sticky.style.position) {
            container.css('position', '');
            sticky.css({
              'position': '',
              'top': '',
              'bottom': '',
            }).removeClass('js-is-sticky').removeClass('js-is-following');
          }
        }
      }

      // set width & height
      if (winST > bp1 && run) {
        if (sticky.style.width !== stkW) {
          parent.css('height', stkH + 'px');
          sticky.css({
            'width': stkW + 'px',
            'box-sizing': 'border-box',
            'margin-top': '0px',
            'margin-bottom': '0px',
          });
        }
      } else {
        if (sticky.style.width) {
          parent.css('height', '');
          sticky.css({
            'width': '',
            'box-sizing': '',
            'margin-top': '',
            'margin-bottom': '',
          });
        }
      }
      
    }

    var that = this;
    window.addEventListener('load', function () { 
      that.init(); 
    });
    gn.optimizedResize.add(function () { 
      that.init(); 
    });
    window.addEventListener('scroll', function () { 
      that.onScroll(); 
    });
  }

  return sticky;
});
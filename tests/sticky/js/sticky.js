// sticky({sticky: '.sticky', wrapper: '.wrapper', padding: '.header'});
// sticky({sticky: '.sticky', wrapper: '.wrapper', padding: 20});

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
    var stickyEls = document.querySelectorAll(options.sticky),
        stickies = (gn.isNodeList(stickyEls)) ? stickyEls : [stickyEls];

    if (stickyEls.length === 0) { 
      console.log('"' + options.nav + '" can\'t be found.'); 
      return;
    }

    for (var i = stickies.length; i--;) {
      var newOptions = options;
      newOptions.nav = stickies[i];

      var a = new stickyCore(newOptions);
    }
  }

  function stickyCore (options) {
    options = gn.extend({ 
      sticky: '.sticky',
      wrapper: false,
      padding: 0,
      position: 'top',
      breakpoints: false,
    }, options || {});

    // set wrapper, padding, position
    var doc = document;
    var sticky = options.sticky;
    var wrapper = (options.wrapper) ? doc.querySelector(options.wrapper) : false;
    var padding = (typeof options.padding === 'number') ? options.padding : doc.querySelector(options.padding).outerHeight();
    var position = options.position;
    var winBp = options.breakpoints;

    if (doc.querySelectorAll(sticky).length > 0) {
      // wrap sticky with '.js-stk-wrapper'
      // set sticky, parent
      var jsStKWrapper = gn.createElement({tagName: 'div', className: 'js-stk-wrapper'});
      doc.querySelector(sticky).wrap();
      var parent = (doc.querySelector(sticky).length > 1) ? doc.querySelector(sticky).eq(0).parent() : doc.querySelector(sticky).parent(),
          stk = (doc.querySelector(sticky).length > 1) ? doc.querySelector(sticky).eq(0) : doc.querySelector(sticky);

      var run = false, bp1, bp2, winST, winW, winH, stkOT, stkW, stkH, wrapperOT, wrapperH;

      // on init and resize: get and set sticky, parent sizes
      function stkResizer() {
        winST = kit.win.ST(),
        winW = kit.win.W();
        winH = kit.win.H();
        stkOT = parent.getTop();
        stkW = stk.outerWidth();
        stkH = parent.outerHeight();
        newStkW = parent.outerWidth();
        newStkH = stk.outerHeight();

        // set window breakpoints
        if (!winBp) {
          run = true;
        } else if (typeof winBp === 'number') {
          if (winW >= winBp) {
            run = true;
          } else {
            run = false;
          }
        } else if (typeof winBp === 'object' && winBp.length >= 2) {
          if (winW >= winBp[0] && winW < winBp[1]) {
            run = true;
          } else {
            run = false;
          }
        }

        if (wrapper) {
          wrapperOT = wrapper.getTop();
          wrapperH = wrapper.outerHeight();
        }


        if (position === 'bottom' || (stkH + padding) > winH) {
          bp1 = (stkOT + stkH + padding) - winH;
          if (wrapper) {
            bp2 = (wrapperOT + wrapperH + padding) - winH;
          }
        } else {
          bp1 = stkOT - padding;
          if (wrapper) {
            bp2 = (wrapperOT + wrapperH) - (stkH + padding);
          }
        }

        if (winST > bp1 && run) {
          if (newStkW !== stkW) {
            stkW = newStkW;
            stk.css({
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
          stk.css({
            'position': '',
            'width': '',
            'box-sizing': '',
            'top': '',
            'bottom': '',
            'margin-top': '',
            'margin-bottom': '',
          });
          parent.css('height', '');

          if (wrapper) { wrapper.css('position', ''); }
        }

        return run, bp1, bp2, stkW, stkH;
      }


      // on scroll: update sticky status
      function stkScroll() { 
        winST = kit.win.ST();

        // set position
        if (!wrapper) {
          if (winST > bp1 && run) {
            if (stk[0].style.position !== 'fixed') {
              stk.css('position', 'fixed').addClass('js-is-sticky');

              if (position === 'bottom' || (stkH + padding) > winH) {
                stk.css('bottom', padding + 'px');
              } else {
                stk.css('top', padding + 'px');
              }
            }
          } else {
            if (stk[0].style.position) {
              stk.css('position', '').removeClass('js-is-sticky');

              if (position === 'bottom' || (stkH + padding) > winH) {
                stk.css('bottom', '');
              } else {
                stk.css('top', '');
              }
            }
          }
        } else {
          if (winST > bp1 && winST <= bp2 && run) {
            if (stk[0].style.position !== 'fixed') {
              wrapper.css('position', '');
              stk.css('position', 'fixed').addClass('js-is-sticky').removeClass('js-is-following');

              if (position === 'bottom' || (stkH + padding) > winH) {
                stk.css({
                  'bottom': padding + 'px',
                  'top': '',
                });
              } else {
                stk.css({
                  'top': padding + 'px',
                  'bottom': '',
                });
              }
            }
          } else if (winST > bp2 && run){
            if (stk[0].style.position !== 'absolute') {
              wrapper.css('position', 'relative');
              stk.css({
                'position': 'absolute',
                'top': '',
              }).removeClass('js-is-sticky').addClass('js-is-following');

              if (position === 'bottom' || (stkH + padding) > winH) {
                stk.css('bottom', padding + 'px');
              } else {
                stk.css('bottom', '0px');
              }
            }
          } else {
            if (stk[0].style.position) {
              wrapper.css('position', '');
              stk.css({
                'position': '',
                'top': '',
                'bottom': '',
              }).removeClass('js-is-sticky').removeClass('js-is-following');
            }
          }
        }

        // set width & height
        if (winST > bp1 && run) {
          if (stk[0].style.width !== stkW) {
            parent.css('height', stkH + 'px');
            stk.css({
              'width': stkW + 'px',
              'box-sizing': 'border-box',
              'margin-top': '0px',
              'margin-bottom': '0px',
            });
          }
        } else {
          if (stk[0].style.width) {
            parent.css('height', '');
            stk.css({
              'width': '',
              'box-sizing': '',
              'margin-top': '',
              'margin-bottom': '',
            });
          }
        }
        
      }

      winLoad(function () { stkResizer(); });
      winResize(function () { stkResizer(); });
      winScroll(function () { stkScroll(); });
    } else {
      console.log('"' + sticky + '" can\'t be found.');
    }

  }

  return sticky;
});
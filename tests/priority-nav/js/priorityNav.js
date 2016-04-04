/**
  * priorityNav 
  * 
  * DEPENDENCIES:
  *
  * == IE8 ==
  * html5shiv
  * forEach
  * pageXOffset
  * addEventListener
  *
  * == all ==
  * remove
  * classlist
  * Length.js
  * getOuterWidth
  * isNodeList
  * prepend
  * append
  * requestAnimationFrame
  * optimizedResize
  * extend
  */

;(function (priorityNavJS) {
  window.priorityNav = priorityNavJS();
})(function () {
  'use strict';

  function priorityNav (options) {
    var navEls = document.querySelectorAll(options.nav);

    if (navEls.length === 0) { 
      console.log('"' + options.nav + '" can\'t be found.'); 
      return;
    }

    for (var i = navEls.length; i--;) {
      var newOptions = options;
      newOptions.nav = navEls[i];

      var a = new PriorityNavCore(newOptions);
    }

  }

  function PriorityNavCore(options) {
    options = gn.extend({
      nav: document.querySelector('.priority-nav'),
      button: 'more',
      showAll: 0,
      hideAll: 0,
    }, options || {});

    var 
        nav = options.nav,
        visibleContainer = nav.querySelector('ul'),
        visibleItems = visibleContainer.children,
        hiddenContainer,
        hiddenItems,
        btn,
        btnWidth,
        
        fragment = document.createDocumentFragment(),
        bp = [],
        bpV = [],
        bpH = [],
        availableSpace,
        currentCount,
        count,
        initialized = false;

    nav.classList.add('js-priority-nav');

    // init
    this.init = function () {
      nav.querySelector('ul').classList.add('js-nav-visible');
      gn.prepend(nav, '<button class="js-nav-toggle" data-count="">' + options.button + '</button>');
      gn.append(nav, '<ul class="js-nav-hidden is-hidden"></ul>');

      hiddenContainer = nav.querySelector('.js-nav-hidden');
      hiddenItems = hiddenContainer.children;
      btn = nav.querySelector('.js-nav-toggle');
      btnWidth = gn.getOuterWidth(btn);

      var that = this;
      btn.addEventListener('click', function () {
        hiddenContainer.classList.toggle('is-hidden');
      });

      initialized = true;
    };

    // destory
    this.destory = function () {
      nav.classList.remove('js-priority-nav');
      visibleContainer.classList.remove('js-nav-visible');
      hiddenContainer.remove();
      btn.remove();
      initialized = false;
    };
    
    // get breakpoints
    this.getBreakpoints = function () {
      var isLastItem = false;
      for (var i = visibleItems.length; i--;) {
        if (isLastItem) { visibleItems[i + 1].style.display = 'none'; }
        var width = gn.getOuterWidth(visibleContainer) + 1;
        bp.unshift(width);
        bpV.unshift(width);
        isLastItem = true;
      }

      for (var j = 0, len = visibleItems.length; j < len; j++) {
        visibleItems[j].style.display = '';
      }
    };
    this.getBreakpoints();

    // prepend
    this.prependItemsToFragment = function () {
      gn.prepend(fragment, visibleItems[bpV.length - 1]);

      bpH.unshift(bpV[bpV.length - 1]);
      bpV.splice(-1, 1);
    };

    // append
    this.appendItemsToFragment = function () {
      gn.append(fragment, hiddenItems[0]);

      bpV.push(bpH[0]);
      bpH.shift();
    };

    // update nav
    this.updateNav = function () {
      this.windowWidth = window.innerWidth;
      this.outerWidth = gn.getOuterWidth(nav);

      if (this.outerWidth >= bp[bp.length - 1] || this.windowWidth < options.showAll) {

        if (initialized) {
          if (bpH.length > 0) {
            while(bpH.length > 0) { 
              this.appendItemsToFragment(); 
            }
            visibleContainer.appendChild(fragment);
          }

          this.destory();
        }

      } else {
        if (!initialized) { this.init(); }

        availableSpace = this.outerWidth - btnWidth;
        if (options.hideAll === 0 || this.windowWidth >= options.hideAll) {

          if (availableSpace <= bpV[bpV.length - 1]) {
            while(availableSpace <= bpV[bpV.length - 1]) { 
              this.prependItemsToFragment(); 
            }
            hiddenContainer.insertBefore(fragment, hiddenContainer.firstChild);

          } else {
            hiddenItems = hiddenContainer.children;
            while(availableSpace > bpH[0]) { 
              this.appendItemsToFragment(); 
            }
            visibleContainer.appendChild(fragment);
          }
        } else {
          if (bpH.length === bp.length) { return; }

          while(bpV.length > 0) { 
            this.prependItemsToFragment(); 
          }
          hiddenContainer.insertBefore(fragment, hiddenContainer.firstChild);
        }

        // update data-count
        currentCount = currentCount || 0;
        count = bpH.length || 0;
        if (count !== currentCount) {
          currentCount = btn.getAttribute("data-count");
          btn.setAttribute("data-count", count);
        }
      }

    };

    // run updateNav
    this.updateNav();
    
    var that = this;
    gn.optimizedResize.add(function () {
      that.updateNav();
    });
  }

  return priorityNav;
});
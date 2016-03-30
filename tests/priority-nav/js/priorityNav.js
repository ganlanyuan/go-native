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
    var navEls = document.querySelectorAll(options.nav),
        navs = (isNodeList(navEls)) ? navEls : [navEls];

    if (navEls.length === 0) { 
      console.log('"' + options.nav + '" can\'t be found.'); 
      return;
    }

    for (var i = navs.length; i--;) {
      var newOptions = options;
      newOptions.nav = navs[i];

      var a = new PriorityNavCore(newOptions);
    }

  };

  function PriorityNavCore(options) {
    options = extend({
      nav: document.querySelector('.priority-nav'),
      button: 'more',
      showAll: 0,
      hideAll: 0,
    }, options || {});

    this.nav = options.nav;

    // init
    this.init = function () {
      this.nav.classList.add('js-priority-nav');
      this.nav.querySelector('ul').classList.add('visible-links');
      prepend(this.nav, '<button class="js-nav-toggle is-hidden" data-count="">' + options.button + '</button>');
      append(this.nav, '<ul class="hidden-links is-hidden"></ul>');
    };
    this.init();
    
    this.visibleContainer = this.nav.querySelector('.visible-links');
    this.visibleItems = this.visibleContainer.children;
    this.hiddenContainer = this.nav.querySelector('.hidden-links');
    this.hiddenItems = this.hiddenContainer.children;
    this.btn = this.nav.querySelector('.js-nav-toggle');
    this.btnWidth = getOuterWidth(this.btn);

    // get breakpoints
    this.getBreakpoints = function () {
      this.bp = [];
      this.bpV = [];
      this.bpH = [];

      for (var j = 0, len = this.visibleItems.length; j < len; j++) {
        var last = this.bp[this.bp.length - 1],
        thisWidth = getOuterWidth(this.visibleItems[j]),
        newWidth = (last) ? last + thisWidth : thisWidth;
        this.bp.push(newWidth);
        this.bpV.push(newWidth);
      }
    };
    this.getBreakpoints();

    // helper functions
    var fragment = document.createDocumentFragment();
    this.prependItemsToFragment = function () {
      prepend(fragment, this.visibleItems[this.bpV.length - 1]);

      this.bpH.unshift(this.bpV[this.bpV.length - 1]);
      this.bpV.splice(-1, 1);

      return fragment;
    };

    this.appendItemsToFragment = function () {
      append(fragment, this.hiddenItems[0]);

      this.bpV.push(this.bpH[0]);
      this.bpH.shift();

      return fragment;
    };

    // update nav
    this.updateNav = function () {
      this.windowWidth = window.innerWidth;
      this.outerWidth = getOuterWidth(this.nav);
      this.availableSpace = this.outerWidth - this.btnWidth;
      this.count;
      this.currentCount;

      if (this.outerWidth >= this.bp[this.bp.length - 1] || this.windowWidth < options.showAll) {
        this.availableSpace = this.outerWidth;
        if (!this.btn.classList.contains('is-hidden')) {
          this.btn.classList.add('is-hidden');
        }

        if (this.bpV.length === this.bp.length) { return; }

        while(this.bpH.length > 0) { this.appendItemsToFragment(); }
        this.visibleContainer.appendChild(fragment);

      } else if (this.windowWidth < options.hideAll) {
        if (this.btn.classList.contains('is-hidden')) {
          this.btn.classList.remove('is-hidden');
        }

        if (this.bpH.length === this.bp.length) { return; }

        while(this.bpV.length > 0) { this.prependItemsToFragment(); }
        this.hiddenContainer.insertBefore(fragment, this.hiddenContainer.firstChild);

      } else {
        if (this.btn.classList.contains('is-hidden')) {
          this.btn.classList.remove('is-hidden');
        }

        if (this.availableSpace <= this.bpV[this.bpV.length - 1]) {
          while(this.availableSpace <= this.bpV[this.bpV.length - 1]) { this.prependItemsToFragment(); }
          this.hiddenContainer.insertBefore(fragment, this.hiddenContainer.firstChild);

        } else {
          this.hiddenItems = this.hiddenContainer.children;
          while(this.availableSpace > this.bpH[0]) { this.appendItemsToFragment(); }
          this.visibleContainer.appendChild(fragment);
        }
      }

      // update data-count
      this.currentCount = this.currentCount || 0;
      this.count = this.bpH.length || 0;
      if (this.count !== this.currentCount) {
        this.currentCount = this.btn.getAttribute("data-count");
        this.btn.setAttribute("data-count", this.count);
      }
    };

    var that = this;

    // show/hide hidden-links
    this.btn.addEventListener('click', function () {
      that.hiddenContainer.classList.toggle('is-hidden');
    });

    // run updateNav
    this.updateNav();
    optimizedResize.add(function () {
      that.updateNav();
    });
  }

  return priorityNav;
});
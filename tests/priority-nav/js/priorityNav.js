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
    var navEls = document.querySelectorAll(options.nav),
        navs = (gn.isNodeList(navEls)) ? navEls : [navEls];

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
    options = gn.extend({
      nav: document.querySelector('.priority-nav'),
      button: 'more',
      showAll: 0,
      hideAll: 0,
    }, options || {});

    var fragment = document.createDocumentFragment();

    this.nav = options.nav;
    this.nav.classList.add('js-priority-nav');
    this.visibleContainer = this.nav.querySelector('ul');
    this.visibleItems = this.visibleContainer.children;
    this.initialized = false;

    // init
    this.init = function () {
      this.nav.querySelector('ul').classList.add('js-nav-visible');
      gn.prepend(this.nav, '<button class="js-nav-toggle" data-count="">' + options.button + '</button>');
      gn.append(this.nav, '<ul class="js-nav-hidden is-hidden"></ul>');

      this.hiddenContainer = this.nav.querySelector('.js-nav-hidden');
      this.hiddenItems = this.hiddenContainer.children;
      this.btn = this.nav.querySelector('.js-nav-toggle');
      this.btnWidth = gn.getOuterWidth(this.btn);

      var that = this;
      this.btn.addEventListener('click', function () {
        that.hiddenContainer.classList.toggle('is-hidden');
      });

      this.initialized = true;
    };

    // distory
    this.distory = function () {
      this.nav.classList.remove('js-priority-nav');
      this.visibleContainer.classList.remove('js-nav-visible');
      this.hiddenContainer.remove();
      this.btn.remove();
      this.initialized = false;
    };
    
    // get breakpoints
    this.getBreakpoints = function () {
      this.bp = [];
      this.bpV = [];
      this.bpH = [];

      var hideItem = false;
      for (var i = this.visibleItems.length; i--;) {
        if (hideItem) { this.visibleItems[i + 1].style.display = 'none'; }
        var width = gn.getOuterWidth(this.visibleContainer) + 1;
        this.bp.unshift(width);
        this.bpV.unshift(width);
        hideItem = true;
      }

      for (var j = 0, len = this.visibleItems.length; j < len; j++) {
        this.visibleItems[j].style.display = '';
      }
    };
    this.getBreakpoints();

    // prepend
    this.prependItemsToFragment = function () {
      gn.prepend(fragment, this.visibleItems[this.bpV.length - 1]);

      this.bpH.unshift(this.bpV[this.bpV.length - 1]);
      this.bpV.splice(-1, 1);

      return fragment;
    };

    // append
    this.appendItemsToFragment = function () {
      gn.append(fragment, this.hiddenItems[0]);

      this.bpV.push(this.bpH[0]);
      this.bpH.shift();

      return fragment;
    };

    // update nav
    this.updateNav = function () {
      this.windowWidth = window.innerWidth;
      this.outerWidth = gn.getOuterWidth(this.nav);

      if (this.outerWidth >= this.bp[this.bp.length - 1] || this.windowWidth < options.showAll) {

        if (this.initialized) {
          if (this.bpH.length > 0) {
            while(this.bpH.length > 0) { this.appendItemsToFragment(); }
            this.visibleContainer.appendChild(fragment);
          }

          this.distory();
        }

      } else {
        if (!this.initialized) { this.init(); }

        this.availableSpace = this.outerWidth - this.btnWidth;
        this.count;
        this.currentCount;

        if (options.hideAll === 0 || this.windowWidth >= options.hideAll) {

          if (this.availableSpace <= this.bpV[this.bpV.length - 1]) {
            while(this.availableSpace <= this.bpV[this.bpV.length - 1]) { this.prependItemsToFragment(); }
            this.hiddenContainer.insertBefore(fragment, this.hiddenContainer.firstChild);

          } else {
            this.hiddenItems = this.hiddenContainer.children;
            while(this.availableSpace > this.bpH[0]) { this.appendItemsToFragment(); }
            this.visibleContainer.appendChild(fragment);
          }
        } else {
          if (this.bpH.length === this.bp.length) { return; }

          while(this.bpV.length > 0) { this.prependItemsToFragment(); }
          this.hiddenContainer.insertBefore(fragment, this.hiddenContainer.firstChild);
        }

        // update data-count
        this.currentCount = this.currentCount || 0;
        this.count = this.bpH.length || 0;
        if (this.count !== this.currentCount) {
          this.currentCount = this.btn.getAttribute("data-count");
          this.btn.setAttribute("data-count", this.count);
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
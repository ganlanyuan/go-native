/**
  * priorityNav 
  * 
  * dependencies:
  * classlist
  * prepend
  * append
  * append
  * firstElementChild
  * getOuterWidth
  * pageXOffset
  * addEventListener
  */
var optimizedResize = (function() {

  var callbacks = [],
  running = false;

  // fired on resize event
  function resize() {

    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }

  }

  // run the actual callbacks
  function runCallbacks() {

    callbacks.forEach(function(callback) {
      callback();
    });

    running = false;
  }

  // adds callback to loop
  function addCallback(callback) {

    if (callback) {
      callbacks.push(callback);
    }

  }

  return {
    // public method to add additional callback
    add: function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    }
  }
}());

  ;(function (priorityNavJS) {
    window.priorityNav = priorityNavJS();
  })(function () {
    'use strict';

    function priorityNav (navSelector, buttonText, showAll, hideAll) {
      var 
      showAll = (typeof showAll === 'undefined' || false || null) ? 0 : showAll,
      hideAll = (typeof hideAll === 'undefined' || false || null) ? 0 : hideAll,
      navEls = document.querySelectorAll(navSelector),
      navs = (isNodeList(navEls)) ? navEls : [navEls];

      if (navEls.length === 0) { console.log('"' + navSelector + '" can\'t be found.'); }

      for (var i = navs.length; i--;) {
        var nav = navs[i];
        var newNav = new PriorityNavCore(nav, buttonText, showAll, hideAll);
      }

    };

    function PriorityNavCore(nav, buttonText, showAll, hideAll) {
      this.nav = nav;

    // init
    this.init = function () {
      this.nav.querySelector('ul').classList.add('visible-links');
      prepend(this.nav, '<button class="js-nav-toggle is-hidden" data-count="">' + buttonText + '</button>');
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

      if (this.outerWidth >= this.bp[this.bp.length - 1] || this.windowWidth < showAll) {
        this.availableSpace = this.outerWidth;
        if (!this.btn.classList.contains('is-hidden')) {
          this.btn.classList.add('is-hidden');
        }

        if (this.bpV.length === this.bp.length) { return; }

        while(this.bpH.length > 0) { this.appendItemsToFragment(); }
        this.visibleContainer.appendChild(fragment);

      } else if (this.windowWidth < hideAll) {
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
    // window.addEventListener('resize', function () {
    //   that.updateNav();
    // });
  }

  return priorityNav;
});
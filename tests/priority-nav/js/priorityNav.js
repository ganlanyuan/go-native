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

function priorityNav (navClass, buttonText, showAll, hideAll) {
  var showAll = (
        typeof showAll !== 'undefined' && 
        showAll !== false && 
        showAll !== null) ? showAll : 0,
      hideAll = (
        typeof hideAll !== 'undefined' && 
        hideAll !== false && 
        hideAll !== null) ? hideAll : 0,
      nav = document.querySelector(navClass);

  // if (nav.length > 0) {
    nav.querySelector('ul').classList.add('visible-links');
    prepend(nav, '<button class="js-nav-toggle is-hidden" data-count="">' + buttonText + '</button>');
    append(nav, '<ul class="hidden-links is-hidden"></ul>');

    var visibleContainer = nav.querySelector('.visible-links'),
        visibleItems = visibleContainer.children,
        hiddenContainer = nav.querySelector('.hidden-links'),
        hiddenItems = hiddenContainer.children,
        btn = nav.querySelector('.js-nav-toggle');

    // get breakpoints
    var bp = [],
        bpV = [],
        bpH = [];
    for (var i = 0, len = visibleItems.length; i < len; i++) {
      var last = bp[bp.length - 1],
          thisWidth = getOuterWidth(visibleItems[i]),
          newWidth = (last) ? last + thisWidth : thisWidth;
      bp.push(newWidth);
      bpV.push(newWidth);
    }

    function hideItems() {
      prepend(hiddenContainer, visibleItems[bpV.length - 1]);

      bpH.unshift(bpV[bpV.length - 1]);
      bpV.splice(-1, 1);
    }

    function showItems() {
      append(visibleContainer, hiddenItems[0]);

      bpV.push(bpH[0]);
      bpH.shift();
    }

    // update nav
    function updateNav () {
      var 
          windowWidth = window.innerWidth,
          btnWidth = getOuterWidth(btn),
          outerWidth = getOuterWidth(nav),
          availableSpace = outerWidth - btnWidth,
          count,
          currentCount;

      if (outerWidth >= bp[bp.length - 1] || windowWidth < showAll) {
        availableSpace = outerWidth;
        if (!btn.classList.contains('is-hidden')) {
          btn.classList.add('is-hidden');
        }

        if (bpV.length === bp.length) { return; }
        while(bpH.length > 0) {
          showItems();
        }
      } else if (windowWidth < hideAll) {
        if (btn.classList.contains('is-hidden')) {
          btn.classList.remove('is-hidden');
        }

        if (bpH.length === bp.length) { return; }
        while(bpV.length > 0) {
          hideItems();
        }
      } else {
        if (btn.classList.contains('is-hidden')) {
          btn.classList.remove('is-hidden');
        }

        if (availableSpace <= bpV[bpV.length - 1]) {
          while(availableSpace <= bpV[bpV.length - 1]) {
            hideItems();
          }
        } else {
          while(availableSpace > bpH[0]) {
            hiddenItems = hiddenContainer.children;
            showItems();
          }
        }
      }

      // update data-count
      currentCount = currentCount || 0;
      count = bpH.length || 0;
      if (count !== currentCount) {
        currentCount = btn.getAttribute("data-count");
        btn.setAttribute("data-count", count);
      }
    }

    // run updateNav
    updateNav();
    window.addEventListener('resize', function () {
      updateNav();
    });

    // show / hide hidden-links
    btn.addEventListener('click', function () {
      hiddenContainer.classList.toggle('is-hidden');
    });
  // } else {
  //   console.log('"' + navClass + '" can\'t be found.');
  // }
};
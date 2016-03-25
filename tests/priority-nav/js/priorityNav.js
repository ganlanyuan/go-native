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

function priorityNav (navClass, buttonText, restore, distory) {
  var restore = (
        typeof restore !== 'undefined' && 
        restore !== false && 
        restore !== null) ? restore : 0,
      distory = (
        typeof distory !== 'undefined' && 
        distory !== false && 
        distory !== null) ? distory : 0,
      nav = document.querySelector(navClass);

  // if (nav.length > 0) {
    nav.querySelector('ul').classList.add('visible-links');
    prepend(nav, '<button class="js-nav-toggle is-hidden" data-count="">' + buttonText + '</button>');
    append(nav, '<ul class="hidden-links is-hidden"></ul>');

    var visibleContainer = nav.querySelector('.visible-links'),
        visibleItems = visibleContainer.children,
        hiddenContainer = nav.querySelector('.hidden-links'),
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

    // update nav
    function updateNav () {
      var 
          windowWidth = window.innerWidth,
          btnWidth = getOuterWidth(btn),
          outerWidth = getOuterWidth(nav),
          availableSpace = outerWidth - btnWidth,
          target,
          current;

      // get target, show/hide btn
      if (outerWidth >= bp[bp.length - 1] || windowWidth < restore) {
        availableSpace = outerWidth;
        btn.classList.add('is-hidden');

        target = bp.length;
      } else if (windowWidth < distory) {

      } else {
        btn.classList.remove('is-hidden');

        if (windowWidth < distory) {
          target = 0;
        } else {
          for (var i = 0, len = bp.length; i < len; i++) {
            if (availableSpace >= bp[i] && availableSpace < bp[i + 1]) {
              target = i + 1;
            } else if (availableSpace < bp[0]) {
              target = 0;
            }
          }
        }
      }
      // console.log(target);

      // set current
      var visibleItems = nav.querySelectorAll('.visible-links > li');
      current = (visibleItems.length) ? visibleItems.length : 0;
      // if (visibleItems.length) {
      // } else {
      //   current = 0;
      // }

      // update
      if (target > current) {
        var a = current;
        while (a < target) {
          var vlink = nav.querySelectorAll('.visible-links');
          var hlinks = nav.querySelectorAll('.hidden-links > li');

          append(vlink, hlinks[0]);
          a++;
        }
      } else if (target < current) {
        var a = current;
        while (a > target ) {
          var visibleItems = nav.querySelectorAll('.visible-links > li');
          var hlinks = nav.querySelectorAll('.hidden-links > li');

          prepend(hiddenContainer, visibleItems[visibleItems.length - 1]);
          a--;
        }
      }

      // update data-count
      var hlinks = nav.querySelectorAll('.hidden-links > li'),
          count;

      if (hlinks.length) {
        count = hlinks.length;
      } else {
        count = 0;
      }
      btn.setAttribute("data-count", count);
    }

    // run updateNav
    updateNav();
    window.addEventListener('resize', function () {
      updateNav();
    });

    // show / hide hidden-links
    btn.addEventListener('click', function () {
      nav.querySelector('.hidden-links').classList.toggle('is-hidden');
    });
  // } else {
  //   console.log('"' + navClass + '" can\'t be found.');
  // }
};
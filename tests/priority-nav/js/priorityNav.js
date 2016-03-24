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
  var restore = (typeof restore !== 'undefined' && restore !== false && restore !== null) ? restore : 0;
  var distory = (typeof distory !== 'undefined' && distory !== false && distory !== null) ? distory : 0;
  
  var d = document,
      nav = d.querySelector(navClass);

  // if (nav.length > 0) {
    var ul = nav.querySelector('ul'),
        vlinks = ul.children;

    ul.classList.add('visible-links');
    prepend(nav, '<button class="js-nav-toggle is-hidden" data-count="">' + buttonText + '</button>');
    append(nav, '<ul class="hidden-links is-hidden"></ul>');

    var btn = nav.querySelector('.js-nav-toggle'),
        hlink = nav.querySelector('.hidden-links');

    // get breakpoints
    var breaks = [];
    for (var i = 0, len = vlinks.length; i < len; i++) {
      var last = breaks[breaks.length - 1],
          thisWidth = getOuterWidth(vlinks[i]),
          newWidth = (last) ? last + thisWidth : thisWidth;
      breaks.push(newWidth);
    };

    // update nav
    function updateNav () {
      var outerWidth = getOuterWidth(nav),
          availableSpace,
          target,
          current,
          ww = window.innerWidth,
          btnWidth = getOuterWidth(btn);

      // get target, show/hide btn
      if (outerWidth >= breaks[breaks.length - 1] || ww < restore) {
        btn.classList.add('is-hidden');
        availableSpace = outerWidth;
        target = breaks.length;
      } else {
        btn.classList.remove('is-hidden');
        availableSpace = outerWidth - btnWidth;

        if (ww < distory) {
          target = 0;
        } else {
          for (var i = 0, len = breaks.length; i < len; i++) {
            if (availableSpace >= breaks[i] && availableSpace < breaks[i + 1]) {
              target = i + 1;
            } else if (availableSpace < breaks[0]) {
              target = 0;
            }
          }
        }
      }
      // console.log(target);

      // set current
      var vlinks = nav.querySelectorAll('.visible-links > li');
      current = (vlinks.length) ? vlinks.length : 0;
      // if (vlinks.length) {
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
          var vlinks = nav.querySelectorAll('.visible-links > li');
          var hlinks = nav.querySelectorAll('.hidden-links > li');

          prepend(hlink, vlinks[vlinks.length - 1]);
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
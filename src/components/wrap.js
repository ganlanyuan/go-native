/** wrap **/
gn.wrap = function (els, obj) {
    var els_new = (gn.isNodeList(els)) ? els : [els];
  // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `wrapper` below).
  for (var i = els_new.length; i--;) {
      var wrapper = (i > 0) ? obj.cloneNode(true) : obj,
          el = els_new[i];

      // Cache the current parent and sibling.
      var parent = el.parentNode,
          sibling = el.nextSibling;

      // Wrap the element (is automatically removed from its current parent).
      wrapper.appendChild(el);

      // If the element had a sibling, insert the wrapper before
      // the sibling to maintain the HTML structure; otherwise, just
      // append it to the parent.
      if (sibling) {
          parent.insertBefore(wrapper, sibling);
      } else {
          parent.appendChild(wrapper);
      }
  }
};


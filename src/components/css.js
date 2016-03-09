// ** get & set styles ** //
function toCamelCase(str) {
  return str.replace(/-([a-z])/ig, function( all, letter ) {
    return letter.toUpperCase();
  });
}

function css(el, css, value) {
  var cssType = typeof css,
      valueType = typeof value,
      elStyle = el.style;

  if (cssType !== "undefined" && valueType === "undefined") {
    if (cssType === "object") {
      // set style info
      for (var prop in css) {
        if (css.hasOwnProperty(prop)) {
          elStyle[toCamelCase(prop)] = css[prop];
        }
      }
    } else if (cssType === "string") {
      // get style info for specified property
      return getStyle(el, css);
    } else {
      throw { message: "Invalid parameter passed to css()" };
    }

  } else if (cssType === "string" && valueType === "string") {
    elStyle[toCamelCase(css)] = value;

  } else {
    throw { message: "Invalid parameters passed to css()" };
  }
}

import "./utilities/childNode.remove";
import "./utilities/number.isNaN";
import "./utilities/string.prototype.repeat";

import "../bower_components/requestAnimationFrame/requestAnimationFrame";
import { isNodeList } from "./gn/isNodeList";
import { append } from "./gn/append";
import { createElement } from "./gn/createElement";
import { ready } from "./gn/ready";
import { extend } from "./gn/extend";
import { getClosest } from "./gn/getClosest";
import { getHeight } from "./gn/getHeight";
import { getOffsetLeft } from "./gn/getOffsetLeft";
import { getOffsetTop } from "./gn/getOffsetTop";
import { getOuterHeight } from "./gn/getOuterHeight";
import { getOuterWidth } from "./gn/getOuterWidth";
import { getParents } from "./gn/getParents";
import { getParentsUntil } from "./gn/getParentsUntil";
import { getSiblings } from "./gn/getSiblings";
import { getSupportedProp } from "./gn/getSupportedProp";
import { getWidth } from "./gn/getWidth";
import { indexOf } from "./gn/indexOf";
import { isInViewport } from "./gn/isInViewport";
import { optimizedResize } from "./gn/optimizedResize";
import { prepend } from "./gn/prepend";
import { unwrap } from "./gn/unwrap";
import { wrap } from "./gn/wrap";
import { wrapAll } from "./gn/wrapAll";

var gn = {
  isNodeList: isNodeList,
  append: append,
  createElement: createElement,
  ready: ready,
  extend: extend,
  getClosest: getClosest,
  getHeight: getHeight,
  getOffsetLeft: getOffsetLeft,
  getOffsetTop: getOffsetTop,
  getOuterHeight: getOuterHeight,
  getOuterWidth: getOuterWidth,
  getParents: getParents,
  getParentsUntil: getParentsUntil,
  getSiblings: getSiblings,
  getSupportedProp: getSupportedProp,
  getWidth: getWidth,
  indexOf: indexOf,
  isInViewport: isInViewport,
  optimizedResize: optimizedResize,
  prepend: prepend,
  unwrap: unwrap,
  wrap: wrap,
  wrapAll: wrapAll,
};
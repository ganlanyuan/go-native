if (!Object.freeze) {
    Object.freeze = function freeze(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.freeze can only be called on Objects.');
      }
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  // detect a Rhino bug and patch it
  try {
    Object.freeze(function () {});
  } catch (exception) {
    Object.freeze = (function (freezeObject) {
      return function freeze(object) {
        if (typeof object === 'function') {
          return object;
        } else {
          return freezeObject(object);
        }
      };
    }(Object.freeze));
}
// freeze
if (!Object.freeze) {
    Object.freeze = function (object) {
        return object;
    };
} else if (require("system").engine.indexOf("rhino") >= 0) {
    // XXX workaround for a Rhino bug.
    var freeze = Object.freeze;
    Object.freeze = function (object) {
        if (typeof object == "function") {
            return object;
        } else {
            return freeze(object);
        }
    };
}
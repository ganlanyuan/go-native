// isFrozen
if (!Object.isFrozen) {
    Object.isFrozen = function (object) {
        return false;
    };
}
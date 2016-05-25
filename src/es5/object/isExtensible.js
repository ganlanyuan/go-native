// isExtensible
if (!Object.isExtensible) {
    Object.isExtensible = function (object) {
        return true;
    };
}
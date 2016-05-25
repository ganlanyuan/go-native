// isSealed
if (!Object.isSealed) {
    Object.isSealed = function (object) {
        return false;
    };
}
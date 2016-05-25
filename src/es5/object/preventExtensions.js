// preventExtensions
if (!Object.preventExtensions) {
    Object.preventExtensions = function (object) {
        return object;
    };
}
// seal
if (!Object.seal) {
    Object.seal = function (object) {
        return object;
    };
}
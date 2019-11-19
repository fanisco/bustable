function probability(list) {
    const length = list.length;
    const count = {};
    list.map(value => count[value] = count[value] >= 0 ? count[value] + 1 : 1);
    return Object.keys(count).map(key => [parseFloat(key), count[key] / length]);
}

function expected(x) {
    if (!x[0].length) {
        x = probability(x);
    }
    return x.map(value => value[0] * value[1]).reduce((sum, i) => sum + i, 0);
}

function variance(x) {
    if (!x[0].length) {
        x = probability(x);
    }
    const mx = expected(x);
    return expected(x.map(value => [Math.pow(value[0] - mx, 2), value[1]]));
}

function standard(x) {
    const dx = variance(x);
    return Math.sqrt(dx);
}

module.exports.px = probability;
module.exports.probability = probability;
module.exports.mx = expected;
module.exports.expected = expected;
module.exports.dx = variance;
module.exports.variance = variance;
module.exports.standard = standard;
module.exports.deviation = standard;

const values = [2.5, 1.8, 2.6, 1.6, 2.1, 2.3, 2.5, 1.3, 2.5, 2.7, 3, 2.5, 1.3, 2.4, 1.3, 2.7, 2.7, 2.4, 3, 3, 2.7, 1.1, 2.7, 2.3, 2.3, 3, 2.3, 1.4, 2.3, 1.8, 2.9, 1.8, 2.1, 1.3, 1.9, 2.8, 1.3, 3, 1.6, 1.1, 2.7, 2.2, 1.9, 1.6, 1.2, 1, 2.4, 2.6, 3, 1.8];

function probability(list) {
    const length = list.length;
    const count = {};
    list.map(value => count[value] = count[value] >= 0 ? count[value] + 1 : 1);
    return Object.keys(count).map(key => [parseFloat(key), count[key] / length]);
}

function expected(x) {
    return x.map(value => value[0] * value[1]).reduce((sum, i) => sum + i, 0);
}

function variance(x) {
    const mx = expected(x);
    return expected(x.map(value => [Math.pow(value[0] - mx, 2), value[1]]));
}

console.log(expected(probability(values)));
console.log(variance(probability(values)));

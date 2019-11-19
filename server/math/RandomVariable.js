const values = [2.5, 1.8, 2.6, 1.6, 2.1, 2.3, 2.5, 1.3, 2.5, 2.7, 3, 2.5, 1.3, 2.4, 1.3, 2.7, 2.7, 2.4, 3, 3, 2.7, 1.1, 2.7, 2.3, 2.3, 3, 2.3, 1.4, 2.3, 1.8, 2.9, 1.8, 2.1, 1.3, 1.9, 2.8, 1.3, 3, 1.6, 1.1, 2.7, 2.2, 1.9, 1.6, 1.2, 1, 2.4, 2.6, 3, 1.8];

function precise(value) {
    return Math.floor(value * 1000) / 1000;
}

function probability(random) {
    const length = random.length;
    const counters = {};
    const prob = [];
    random.map(value => counters[value] = counters[value] >= 0 ? counters[value] + 1 : 1);
    console.log(Object.values(counters).map(value => value / length));
    console.log(random.map(value => [value, 1 / length]));
    return prob;
}

function expected(random) {
    const prob = probability(random);
    const precMult = prob.map(value => precise(value[0] * value[1]));
    return precMult.reduce((sum, i) => precise(sum + i), 0);
}

function variance() {

}


console.log(probability(values));
console.log(expected(values));

function timeFormat(dateTime, format = 'hh:ii:ss') {
    const d = analyzeDatetime(dateTime);
    let h = d[0],
        m = d[1],
        s = d[2];
    return format.replace(/h+|i+|s+/g, str => {
        switch (str) {
            case 'hh':
                return doubleDigit(h);
            case 'ii':
                return doubleDigit(m);
            case 'ss':
                return doubleDigit(s);
            case 'h':
                return h;
            case 'i':
                return m;
            case 's':
                return s;
            default:
                return str;
        }
    });
}

function wordsFormat(dateTime, format, notZero = false) {
    if (format.match(/\|/)) {
        return format.split('|').map(part => wordsFormat(dateTime, part, notZero)).join(' ');
    } else {
        const d = analyzeDatetime(dateTime);
        const l = (x, y) => notZero ? x > 0 ? x+y : '' : x+y;
        let h = d[0],
            m = d[1],
            s = d[2];
        return format.replace(/([his])+(.+)/g, (match, str, suffix) => {
            switch (str) {
                case 'h':
                    return l(h, suffix);
                case 'i':
                    return l(m, suffix) || `> ${suffix}`;
                case 's':
                    return l(s, suffix);
                default:
                    return str;
            }
        });
    }
}

function analyzeDatetime(dateTime) {
    if (dateTime instanceof Date) {
        return [
            dateTime.getHours(),
            dateTime.getMinutes(),
            dateTime.getSeconds()
        ];
    } else {
        const time = dateTime / 1000;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time - h * 3600) / 60);
        const s = Math.floor(time - (h * 3600) - (m * 60));
        return [h, m, s];
    }
}

function doubleDigit(dig) {
    return (dig < 10 ? '0' : '') + dig;
}

function timeSub(time1, time2) {
    return timestampTime(time1) - timestampTime(time2);
}

function timestampTime(time) {
    return (new Date('1970-01-01T' + time)).getTime()
}

module.exports.timeFormat = timeFormat;
module.exports.wordsFormat = wordsFormat;
module.exports.timeSub = timeSub;
module.exports.timestampTime = timestampTime;

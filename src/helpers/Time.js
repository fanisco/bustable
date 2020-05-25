function timeFormat(dateTime, format = 'hh:ii:ss') {
    let h, m, s;
    if (dateTime instanceof Date) {
        h = dateTime.getHours();
        m = dateTime.getMinutes();
        s = dateTime.getSeconds();
    } else {
        const time = dateTime / 1000;
        h = Math.floor(time / 3600);
        m = Math.floor((time - h * 3600) / 60);
        s = Math.floor(time - (h * 3600) - (m * 60));
    }
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

function doubleDigit(dig) {
    return (dig < 10 ? '0' : '') + dig;
}

function timeSub(time1, time2) {
    return timestampTime(time1) - timestampTime(time2);
}

function timestampTime(time) {
    return (new Date('1970-01-01T' + time)).getTime()
}

function leftTime(s, minVal) {
    let format;
    switch (true) {
        case s < 60:
            format = 's сек';
            break;
        case s < minVal:
            format = 'i мин s сек';
            break;
        case s < 3600:
            format = 'i мин';
            break;
        default:
            format = 'h час i мин';
    }
    console.log(s, format, minVal);
    return timeFormat(s * 1000, format);
}

function parseToSeconds(t) {
    const a = t.replace(/\.\d+/, '').split(':');
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}

module.exports.timeFormat = timeFormat;
module.exports.timeSub = timeSub;
module.exports.timestampTime = timestampTime;
module.exports.leftTime = leftTime;
module.exports.parseToSeconds = parseToSeconds;

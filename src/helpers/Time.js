function timeFormat(dateTime, format = 'his') {
    let h, m, s;
    const time = [];
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
    h = (h < 10 ? '0' : '') + h;
    m = (m < 10 ? '0' : '') + m;
    s = (s < 10 ? '0' : '') + s;
    if (/h/.test(format)) { time.push(h) }
    if (/i/.test(format)) { time.push(m) }
    if (/s/.test(format)) { time.push(s) }
    return time.join(':');
}

function timeSub(time1, time2) {
    return timestampTime(time1) - timestampTime(time2);
}

function timestampTime(time) {
    return (new Date('1970-01-01T' + time)).getTime()
}

module.exports.timeFormat = timeFormat;
module.exports.timeSub = timeSub;
module.exports.timestampTime = timestampTime;

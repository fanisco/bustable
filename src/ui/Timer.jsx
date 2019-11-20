import React, { useState } from 'react';
import './Timer.scss';

export default function Timer({ time, format, countdown = false }) {
    const [value, setValue] = useState(display(time, format, countdown));
    setInterval(() => {
        setValue(display(time, format, countdown));
    }, 1000);
    return (
        <div className="Timer">{value}</div>
    );
}

function display(dateTime = new Date(), format, countdown) {
    if (countdown) {
        dateTime = timeSub(dateTime, timeFormat(new Date()));
    }
    return timeFormat(dateTime, format);
}

function timeSub(time1, time2) {
    return new Date('1970-01-01T' + time1) - new Date('1970-01-01T' + time2);
}

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

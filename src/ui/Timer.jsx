import React, { useState } from 'react';
import './Timer.scss';
import { timeSub, timeFormat } from '../helpers/Time';

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

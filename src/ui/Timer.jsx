import React, { useState } from 'react';
import './Timer.scss';
import { timeFormat } from '../helpers/Time';

export default function Timer({ value, format }) {
    const [displayValue, setDisplayValue] = useState(display(value, format));
    setInterval(() => {
        setDisplayValue(display(value, format));
    }, 1000);
    return (
        <div className="Timer">{displayValue}</div>
    );
}

function display(value = new Date(), format) {
    return timeFormat(value, format);
}

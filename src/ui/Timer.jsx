import React, { useState } from 'react';
import './Timer.scss';

export default function Timer() {
    const [state, setState] = useState(time());
    setInterval(() => {
        setState(time());
    }, 1000);
    return (
        <div className="Timer">{state.h}:{state.m}:{state.s}</div>
    );
}

function time() {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return {
        h: (h < 10 ? '0' : '') + h,
        m: (m < 10 ? '0' : '') + m,
        s: (s < 10 ? '0' : '') + s
    }
}

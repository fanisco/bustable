import React, {useState} from 'react';
import {leftTime, parseToSeconds} from '../../helpers/Time';
import useInterval from '../../hooks/useInterval';
const minVal = process.env.REACT_APP_REFRESH_INTERVAL / 1000;

export default function Arrival({value}) {
    const wait = parseToSeconds(value.wait) - 1;
    const [count, setCount] = useState(0);
    useInterval(() => setCount(count + 1), 1000);
    if (wait - count >= 0) {
        return (
            <div>{leftTime(wait - count, minVal)}</div>
        );
    } else {
        return (
            <div style={{color: '#f00'}}>+{leftTime(count - wait, minVal)}</div>
        );
    }
}

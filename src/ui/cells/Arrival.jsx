import React, {useState, useEffect} from 'react';
import {leftTime, parseToSeconds} from '../../helpers/Time';
import useInterval from '../../hooks/useInterval';
const minVal = process.env.REACT_APP_REFRESH_INTERVAL / 1000;
const refreshIterval = 1000;
const checkInterval = 10000;

export default function Arrival({rawData, callbacks, value}) {
    const wait = parseToSeconds(value.wait) - 1;
    const [count, setCount] = useState(0);
    const left = wait - count;
    useInterval(() => setCount(count + 1), refreshIterval);
    useInterval(() => left < 0 && callbacks.needCheckWay(rawData.objectId), checkInterval);
    useEffect(() => setCount(0), [wait]);
    if (left >= 0) {
        return (
            <div>{leftTime(left, minVal)}</div>
        );
    } else {
        return (
            <div style={{color: '#f00'}}>+{leftTime(count - wait, minVal)}</div>
        );
    }
}

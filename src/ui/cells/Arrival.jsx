import React, {useState} from 'react';
import {leftTime, parseToSeconds} from '../../helpers/Time';
const minVal = process.env.REACT_APP_REFRESH_INTERVAL / 1000;

export default function Arrival({value}) {
    const waitSec = parseToSeconds(value.wait) - 1;
    const [sec, setSec] = useState(waitSec);
    // console.log(waitSec, sec, minVal);
    // if (sec < minVal) {
    //     setInterval(() => setSec(sec - 1), 1000);
    // }
    return (
        <div>{leftTime(sec, minVal)}</div>
    );
}

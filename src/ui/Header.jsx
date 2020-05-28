import React from 'react';
import Timer from './Timer';
import './Header.scss';

/**
 * @param {Object} props
 */
export default function Header({stop}) {
    return (
        <div className="Header">
            <div className="Header__stop">{stop.name}</div>
            <div className="Header__timer">
                <Timer/>
            </div>
        </div>
    );
}

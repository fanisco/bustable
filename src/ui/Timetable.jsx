import React from 'react';
import './Timetable.scss';
import Timer from './Timer'

export default function Timetable() {
    return (
        <div className="Timetable">
            <header className="Timetable__header">
                <div className="Timetable__timer">
                    <Timer/>
                </div>
            </header>
        </div>
    );
}

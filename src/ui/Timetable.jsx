import React from 'react';
import './Timetable.scss';
import Timer from './Timer'

export default function Timetable(props) {
    const [headers, columns] = dataTransform(props.data, props.options);
    return (
        <div className="Timetable">
            <div className="Timetable__timer">
                <Timer/>
            </div>
            <div className="Timetable__grid" style={'grid-template-columns: 1fr 1fr 1fr;'}>
                <header className="Timetable__header">
                    {headers.map((header, i) => {
                        const options = props.options[header];
                        return (
                            <div key={i} className={`Timetable__cell Timetable__cell_${options.align || 'left'}`}>{
                                options.title || header
                            }</div>
                        );
                    })}
                </header>
                <main className="Timetable__content">
                    {columns.map((row, i) => {
                        return (
                            <div key={i} className="Timetable__row">
                                {row.map((value, j) => {
                                    const header = headers[j];
                                    const options = props.options[header];
                                    return (
                                        <div key={j} className={`Timetable__cell Timetable__cell_${options.align || 'left'}`}>{value}</div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </main>
            </div>
        </div>
    );
}

function dataTransform(rows, options) {
    const headers = [];
    const columns = [];
    for (const row of rows) {
        for (const key of Object.keys(row)) {
            if (headers.indexOf(key) === -1) {
                headers.push(key);
            }
        }
        columns.push(Object.values(row));
    }
    return [headers, columns];
}

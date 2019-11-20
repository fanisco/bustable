import React from 'react';
import './Timetable.scss';
import Timer from './Timer'

/**
 * @param {Object} props
 */
export default function Timetable(props) {
    const { data, columns } = props;
    const [headers, widths, items] = dataTransform(data, columns);
    return (
        <div className="Timetable">
            <div className="Timetable__top">
                <div className="Timetable__stop">Callate la boca</div>
                <div className="Timetable__timer">
                    <Timer/>
                </div>
            </div>
            <div className="Timetable__grid" style={{
                'gridTemplateColumns': widths.join(' ')
            }}>
                <header className="Timetable__header">
                    {headers.map((header, i) => <Cell key={i} align={columns[header].align} value={columns[header].title}/>)}
                </header>
                <main className="Timetable__items">
                    {items.map((item, i) => {
                        return (
                            <div key={i} className="Timetable__row">
                                {item.columns.map((column, j) => <Cell key={j} {...column}/>)}
                            </div>
                        );
                    })}
                </main>
            </div>
        </div>
    );
}

/**
 * @param {Object} props
 */
const Cell = (props) => {
    return (
        <div className={`Timetable__cell Timetable__cell_${props.align}`}>{props.value}</div>
    );
};

/**
 * @param {Array} rows
 * @param {Object} columns
 */
function dataTransform(rows, columns) {
    const headers = [];
    const widths = [];
    const items = [];
    for (const row of rows) {
        const item = { columns: [] };
        const names = Object.keys(columns);
        for (const name of names) {
            if (headers.indexOf(name) === -1) {
                headers.push(name);
                widths.push(columns[name].width);
            }
            item.columns.push({
                name: name,
                value: row[name],
                title: columns[name].title,
                align: columns[name].align || 'left',
                width: columns[name].width || '1fr',
                options: columns[name].options
            });
        }
        items.push(item);

    }
    return [headers, widths, items];
}

import React from 'react';
import './Timetable.scss';

/**
 * @param {Object} props
 */
export default function Timetable(props) {
    const {table, columns} = props;
    const [headers, widths, items] = dataTransform(table, columns);
    return (
        <div className="Timetable" style={{
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
    );
}

/**
 * @param {Object} props
 */
export const Cell = (props) => {
    let render = '';
    if (props.template) {
        render = <props.template {...props}/>;
    }
    if (typeof props.value !== 'object') {
        render = props.value;
    }
    return (
        <div className={`Timetable__cell Timetable__cell_${props.align}`}>{render}</div>
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
                rawData: row,
                name: name,
                value: row[name],
                title: columns[name].title,
                align: columns[name].align || 'left',
                width: columns[name].width || '1fr',
                options: columns[name].options,
                template: columns[name].template,
                callbacks: columns[name].callbacks
            });
        }
        items.push(item);
    }
    return [headers, widths, items];
}

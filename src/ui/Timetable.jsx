import React, {useState} from 'react';
import useWindowResize from '../hooks/useWindowResize';
import './Timetable.scss';

/**
 * @param {Object} props
 */
export default function Timetable(props) {
    const [width, setWidth] = useState(window.innerWidth);
    const {table, items} = dataTransform(props, width);
    useWindowResize(() => setWidth(window.innerWidth));
    return (
        <div className="Timetable" style={{
            'gridTemplateColumns': table.map(col => col.width).join(' ')
        }}>
            <header className="Timetable__header">
                {table.map((col, i) => <Cell key={i} align={col.align} value={col.title}/>)}
            </header>
            <main className="Timetable__items">
                {items.map((item, i) => {
                    return (
                        <div key={i} className="Timetable__row">
                            {item.map((column, j) => <Cell key={j} {...column}/>)}
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
 * @param {Array} data
 * @param {Object} columns
 * @param {Object} callbacks
 * @param {Number} width
 */
function dataTransform({data, columns, callbacks}, width) {
    const table = columns.filter(col => !col.visibility || col.visibility(width));
    const items = [];
    for (const row of data) {
        items.push(table.map(col => ({
            rawData: row,
            name: col.name,
            value: row[col.name],
            title: col.title,
            align: col.align || 'left',
            width: col.width || '1fr',
            options: col.options,
            template: col.template,
            callbacks
        })));
    }
    return {table, items};
}

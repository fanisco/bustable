import React from 'react';
import './Seats.scss';

export default function Seats({value}) {
    if (value.total || value.occupied) {
        const text = `${value.occupied}${value.total && value.occupied ? '/' : ''}${value.total}`;
        return (
            <div className="Seats">
                <i className="Seats__icon material-icons">airline_seat_recline_normal</i>
                {text}
            </div>
        );
    } else {
        return <div className="Seats"/>;
    }
}

import React from 'react';
import './Route.scss';

export default function Route({value}) {
    return (
        <div className="Route">
            <span className="Route__name">{value.code !== 'А' ? value.code : ''} {value.name}</span>
        </div>
    );
}

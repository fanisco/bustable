import React from 'react';
import './Stop.scss';

export default function Stop({value}) {
    return (
        <div className="Stop">{value.name}</div>
    );
}

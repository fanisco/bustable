import React from 'react';
import './Status.scss';
import {FETCHING, SUCCESS, ERROR} from '../state/types';

const statuses = {
    [FETCHING]: 'Загрузка',
    [SUCCESS]: '',
    [ERROR]: 'Ошибка'
};

export default function Status({status}) {
    return <div className="Status">{statuses[status]}</div>;
}

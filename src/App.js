import React, {useEffect, useContext} from 'react';
import {Store} from './state/Store';
import useInterval from './hooks/useInterval';
import Header from './ui/Header';
import Timetable from './ui/Timetable';
import Status from './ui/Status';
import columns from './ui/cells/columns';
import {checkWay, getStop, getTable} from './state/actions';
import './App.scss';

/**
 * Ядро интерфейсного приложения.
 */
const App = () => {
    const stopId = process.env.REACT_APP_STOP_ID;
    const {state, dispatch} = useContext(Store);

    // Первичная подгрузка
    useEffect(() => {
        const fetchData = async () => {
            await getStop({dispatch, stopId: stopId});
            await getTable({dispatch, stopId: stopId});
        };

        // Получение данных
        fetchData();
    }, [dispatch, stopId]);

    // Обновление таблицы
    useInterval(() => getTable({dispatch, stopId: stopId}), process.env.REACT_APP_REFRESH_INTERVAL);
    return (
        <div className="App">
            <Header stop={state.stop}/>
            <Timetable
                data={state.table}
                columns={columns}
                callbacks={{
                    needCheckWay: objectId => checkWay({dispatch, stopId, objectId})
                }}
            />
            <Status status={state.status}/>
        </div>
    );
};

export default App;

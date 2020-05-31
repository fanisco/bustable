import React, {useEffect, useContext} from 'react';
import {Store} from './state/Store';
import useInterval from './hooks/useInterval';
import Header from './ui/Header';
import Timetable from './ui/Timetable';
import Status from './ui/Status';
import Route from './ui/cells/Route';
import Stop from './ui/cells/Stop';
import Arrival from './ui/cells/Arrival';
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
                table={state.table}
                columns={{
                    route: {title: '№', align: 'left', width: '10%', template: Route},
                    destination: {title: '', align: 'left', width: '1fr', template: Stop},
                    stop: {title: 'Направление', align: 'left', width: '1fr', template: Stop},
                    arrival: {
                        title: 'Прибытие',
                        align: 'right',
                        width: '20%',
                        template: Arrival,
                        callbacks: {
                            needCheckWay: objectId => checkWay({dispatch, stopId, objectId})
                        }
                    }
                }}
            />
            <Status status={state.status}/>
        </div>
    );
};

export default App;

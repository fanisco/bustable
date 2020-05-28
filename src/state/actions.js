import axios from 'axios';
import {FETCHING, SUCCESS, ERROR, SET_STATUS, GET_STOP, GET_TABLE, CHECK_WAY} from './types';

export const getStop = async ({dispatch, stopId}) => {
    return fetchData(GET_STOP, {
        dispatch,
        verb: 'get',
        url: `/api/stop/${stopId}`
    });
};

export const getTable = ({dispatch, stopId}) => {
    return fetchData(GET_TABLE, {
        dispatch,
        verb: 'get',
        url: `/api/gpstable/${stopId}`
    });
};

export const checkWay = ({dispatch, stopId, objectId}) => {
    return fetchData(CHECK_WAY, {
        dispatch,
        verb: 'get',
        url: `/api/checkway?stopId=${stopId}&objectId=${objectId}`
    });
};

const fetchData = async (action, {dispatch, verb, url, params}) => {
    dispatch({type: SET_STATUS, status: FETCHING});
    try {
        const res = await axios[verb](url, params);
        dispatch({type: action, data: res.data});
        dispatch({type: SET_STATUS, status: SUCCESS});
    } catch(e) {
        dispatch({type: SET_STATUS, status: ERROR});
    }
};

import {SET_STATUS, GET_STOP, GET_TABLE, CHECK_WAY} from './types';

export default function reducer(state, action) {
    switch (action.type) {
        case SET_STATUS:
            return {
                ...state,
                status: action.status
            };
        case GET_STOP:
            return {
                ...state,
                stop: action.data
            };
        case GET_TABLE:
            return {
                ...state,
                table: action.data
            };
        case CHECK_WAY:
            return {
                ...state,
                table: action.data.is ? state.table : state.table.filter(row => row.objectId !== action.data.objectId)
            };
        default:
            return state;
    }
}

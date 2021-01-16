import { combineReducers } from 'redux';
import room from "./room";
import user from "./user";


const appReducer = combineReducers({ room, user });

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer
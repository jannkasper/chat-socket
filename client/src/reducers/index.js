import { combineReducers } from 'redux';
import room from "./room";
import user from "./user";
import activities from "./activities";


const appReducer = combineReducers({ room, user, activities });

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer
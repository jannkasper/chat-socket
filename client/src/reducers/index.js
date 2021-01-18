import { combineReducers } from 'redux';
import room from "./room";
import user from "./user";
import activities from "./activities";
import app from "./app"


const appReducer = combineReducers({ room, user, activities, app });

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer
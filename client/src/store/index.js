import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducers from "../reducers";


const enabledMiddlewares = [thunk];

const middlewares = applyMiddleware(...enabledMiddlewares);

const configureStore = (preloadedState) => {
    const store = createStore(reducers, preloadedState, compose(middlewares));

    return store;
}

export default configureStore
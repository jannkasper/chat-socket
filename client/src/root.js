import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import shortId from 'shortid';
import configureStore from "./store";
import Home from "./components/Home";

const store = configureStore();

class Root extends Component {


    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to={`/${shortId.generate()}`} />} />
                        <Route path="/:roomId" component={Home}/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}

export default Root
import React, { Component } from "react";
import { Redirect } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import shortId from 'shortid';
import Home from "./components/Home/Home";



class Root extends Component {


    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to={`/${shortId.generate()}`} />} />
                    <Route path="/:roomId" component={Home}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Root
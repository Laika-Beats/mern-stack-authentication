import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./style.css";

export default function App() {
    return (
        < >
            <BrowserRouter>
                <Header></Header>
                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/register" component={Register}></Route>
                </Switch>
            </BrowserRouter>
        </>
    );
};
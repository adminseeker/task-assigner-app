import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Room from "../components/Room";




const history = createHistory();

const AppRouter = ()=>{
    return(
        <Router history={history}>
            <Switch>
                <Route path="/" component={Landing} exact={true}/>
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <PrivateRoute path="/dashboard" component={Dashboard} />
                <PrivateRoute path="/rooms/:id" component={Room} />
            </Switch>
        </Router>
    )
}

export default AppRouter;
import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";


const history = createHistory();

const AppRouter = ()=>{
    return(
        <Router history={history}>
            <Switch>
                <Route path="/" component={Landing} exact={true}/>
                <Route path="/signup" component={Register} exact={true}/>
                <Route path="/login" component={Login} exact={true}/>
                <PrivateRoute path="/dashboard" component={Dashboard} exact={true}/>
            </Switch>
        </Router>
    )
}

export default AppRouter;
import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Room from "../components/Room";
import Student from "../components/Student";
import Teacher from "../components/Teacher";




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
                <PrivateRoute path="/profile/student/:id" component={Student} />
                <PrivateRoute path="/profile/teacher/:id" component={Teacher} />
            </Switch>
        </Router>
    )
}

export default AppRouter;
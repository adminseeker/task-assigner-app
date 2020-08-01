import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import TeacherTest from "../components/TeacherTest";
import StudentTest from "../components/StudentTest";



const history = createHistory();

const AppRouter = ()=>{
    return(
        <Router history={history}>
            <Switch>
                <Route path="/" component={Landing} exact={true}/>
                <Route path="/signup" component={Register} exact={true}/>
                <Route path="/login" component={Login} exact={true}/>
                <PrivateRoute path="/dashboard" component={Dashboard} exact={true}/>
                <PrivateRoute path="/teacher" component={TeacherTest} exact={true}/>
                <PrivateRoute path="/student" component={StudentTest} exact={true}/>
            </Switch>
        </Router>
    )
}

export default AppRouter;
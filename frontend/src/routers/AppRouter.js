import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Register from "../components/Register";

const history = createHistory();

const AppRouter = ()=>{
    return(
        <Router history={history}>
            <Switch>
                <Route path="/" component={Landing} exact={true}/>
                <Route path="/signup" component={Register} />
            </Switch>
        </Router>
    )
}

export default AppRouter;
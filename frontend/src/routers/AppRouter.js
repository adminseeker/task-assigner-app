import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory"
import Landing from "../components/Landing";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Room from "../components/Room";
import Student from "../components/Student";
import Teacher from "../components/Teacher";
import Submissions from "../components/Submissions";
import Header from "../components/Header";
import Logout from "../components/Logout";
import StudentList from "../components/StudentList";
import InviteStudents from "../components/InviteStudents";
import ResourcesList from "../components/ResourcesList";
import AssignmentView from "../components/AssignmentView";
import SubmissionsList from "../components/SubmissionsList";
import JoinStudents from "../components/JoinStudents";
import MaterialsList from "../components/MaterialsList";
import RegisterStudent from "../components/RegisterStudent";
import RegisterTeacher from "../components/RegisterTeacher";




const history = createHistory();

const AppRouter = ()=>{
    return(
        <Router history={history}>
            <Header />
            <Switch>
                <Route path="/" component={Landing} exact={true}/>
                <Route path="/register/student" component={RegisterStudent} exact={true}/>
                <Route path="/register/teacher" component={RegisterTeacher} exact={true}/>
                <Route path="/login" component={Login} exact={true}/>
                <PrivateRoute path="/dashboard" component={Dashboard} exact={true}/>
                <PrivateRoute path="/join" component={JoinStudents} exact={true}/>
                <PrivateRoute path="/rooms/:id" component={Room} exact={true}/>
                <PrivateRoute path="/rooms/:id/students" component={StudentList} exact={true}/>
                <PrivateRoute path="/rooms/:id/students/invite" component={InviteStudents} exact={true}/>
                <PrivateRoute path="/rooms/:id/assignments/" component={ResourcesList} exact={true}/>
                <PrivateRoute path="/rooms/:id/materials/" component={MaterialsList} exact={true}/>
                <PrivateRoute path="/rooms/:id1/assignments/:id2" component={AssignmentView} exact={true}/>
                <PrivateRoute path="/rooms/:id1/assignments/:id2/submissions/:id3" component={SubmissionsList} exact={true}/>
                <PrivateRoute path="/rooms/:id1/assignments/:id2/submissions" component={Submissions} exact={true}/>
                <PrivateRoute path="/profile/student/:id" component={Student} exact={true}/>
                <PrivateRoute path="/profile/teacher/:id" component={Teacher} exact={true}/>
                <PrivateRoute path="/logout" component={Logout} exact={true}/>
                
            </Switch>
        </Router>
    )
}

export default AppRouter;

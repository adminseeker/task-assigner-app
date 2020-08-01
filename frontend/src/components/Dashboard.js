import React from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = (props)=>{
    return(
        <div>
            <h1>Dashboard Page!</h1>
            <button onClick={(e)=>{
                props.dispatch(logout());
            }}>Logout</button><br/>
            <Link to="/student">student</Link><br/>
            <Link to="/teacher">teacher</Link><br/>
        </div>
    )
}

export default connect()(Dashboard);
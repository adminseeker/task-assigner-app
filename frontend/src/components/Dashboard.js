import React from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";

const Dashboard = (props)=>{
    return(
        <div>
            <h1>Dashboard Page!</h1>
            <button onClick={(e)=>{
                props.dispatch(logout());
            }}>Logout</button>
        </div>
    )
}

export default connect()(Dashboard);
import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions/auth";

const Logout = (props) => {
    props.dispatch(logout());
    return (
        <div>
            
        </div>
    )
}

export default connect()(Logout);
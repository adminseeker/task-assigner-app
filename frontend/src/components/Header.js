import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";

const Header = (props) => {
    return (
            <nav className="header">
                <div className="header__container">
                {!props.isAuthenticated && <h1>{<Link to="/">Tasker</Link>}</h1>}
                {props.isAuthenticated && <h1>{<Link to="/dashboard">Tasker</Link>}</h1>}
                <ul>
                    {!props.isAuthenticated && <li className="header__content">{<Link to="/login">Login</Link>}</li>}
                    {!props.isAuthenticated && <li className="header__content">{<Link to="/Register">Register</Link>}</li>}
                    {props.isAuthenticated && <li className="header__content"><button onClick={(e)=>{
                        props.dispatch(logout());
                    }}>Logout</button></li>}
                </ul>
                </div>
            </nav>
    )
}

const mapStateToProps = (state)=>({
    isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Header);
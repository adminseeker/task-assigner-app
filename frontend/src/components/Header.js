import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { getRooms } from "../actions/rooms";
import LoadingPage from "./LoadingPage";

const Header = ({user,isAuthenticated,logout}) => {
    useEffect(()=>{
        getRooms()
    },[]);
    
    return user==null && isAuthenticated ? <LoadingPage/> : (
            <nav className="header">
                <div className="header__container">
                {!isAuthenticated && <h1>{<Link to="/">Tasker</Link>}</h1>}
                {isAuthenticated && <h1>{<Link to="/dashboard">Tasker</Link>}</h1>}
                <ul>
                    {!isAuthenticated && <li className="header__content">{<Link to="/login">Login</Link>}</li>}
                    {!isAuthenticated && <li className="header__content">{<Link to="/Register">Register</Link>}</li>}
                    {isAuthenticated && <li className="header__content__name">{<Link to="/dashboard">{user.name}</Link>}</li>}
                    {isAuthenticated && <li className="header__content"><Link to="/logout">Logout</Link></li>}
                </ul>
                </div>
            </nav>
    )
}

const mapStateToProps = (state)=>({
    isAuthenticated:state.auth.isAuthenticated,
    user:state.auth.user
})

export default connect(mapStateToProps,{logout})(Header);
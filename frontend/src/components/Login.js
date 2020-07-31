import React, { useState } from "react";
import {login} from "../actions/auth";
import {connect} from "react-redux";
import { Redirect } from "react-router-dom";

const Login = (props)=>{
    const [formData,setFormData] = useState({
        email:"",
        password:"",
        error:""
    });
    const {email,password,error} = formData;

    if(props.isAuthenticated){
        return <Redirect to="/dashboard" />
    }

    const onChange = (e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        props.dispatch(login({email,password})).catch((error)=>{
            console.log(error);
        });
    }

    return(
        <div>
            <h1>Login Page!</h1>
            {error && <h2>{error}</h2>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" name="email" value={email} id="email" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" value={password} id="password" onChange={onChange}/>
                </div>
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Login);
import React, { useState } from "react";
import {register} from "../actions/auth";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {setAlert} from "../actions/alert";

const Register = (props)=>{

    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:"",
        password2:"",
        isTeacher:false,
        phone:""
    });

    if(props.isAuthenticated){
        return <Redirect to="/dashboard" />
    }
    

    const {name,email,password,password2,isTeacher,phone} = formData;

    

    const onChange = (e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        if(password!==password2){
            props.dispatch(setAlert("Passwords do not match!!","danger",6000));
        }else{
            props.dispatch(register({name,email,password,isTeacher,phone}));
        }
    }

    return(
        <div>
            <h1>Register Page!</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name</label><br />
                    <input type="text" name="name" value={name} id="name" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" name="email" value={email} id="email" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="password">Password</label><br />
                    <input type="password" name="password" value={password} id="password" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="password2">Confirm Password</label><br />
                    <input type="password" name="password2" value={password2} id="password2" onChange={onChange}/>
                </div>
                <div>
                    <label htmlFor="isTeacher">Profession</label><br />
                    <select name="isTeacher" id="isTeacher" value={isTeacher} onChange={onChange}>
                        <option value={true}>Teacher</option>
                        <option value={false}>Student</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="phone">Phone</label><br />
                    <input type="number" name="phone" value={phone} id="phone" onChange={onChange}/>
                </div>
                <br />
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Register);
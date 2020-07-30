import React, { useState } from "react";

const Register = ()=>{
    const [formData,setFormData] = useState({
        name:"",
        email:"",
        password:"",
        password2:"",
        isTeacher:"",
        phone:"",
        error:""
    });
    const {name,email,password,password2,isTeacher,phone,error} = formData;

    const onChange = (e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        if(password!==password2){
            setFormData({...formData, error:"Passwords do not match!"});
        }else{
            console.log(formData);
        }
    }

    return(
        <div>
            <h1>Register Page!</h1>
            {error && <h2>{error}</h2>}
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
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Register;
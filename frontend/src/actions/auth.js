import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

const register = ({name,email,password,isTeacher,phone})=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const body = JSON.stringify({name,email,password,isTeacher,phone});
        try {
            const res = await axios.post("/api/users",body,config);
            if(res.data.msg){
                await dispatch({
                    type:"REGISTER_FAIL"
                })
                return res.data.msg;
            }else{
                await  dispatch({
                    type:"REGISTER_SUCCESS",
                    token:res.data.token
                });
                await dispatch(loadUser());
            }
        } catch (err) {
            console.log(err);
              dispatch({
                type:"REGISTER_FAIL"
            })
        }
    }
}

const login = ({email,password})=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const body = JSON.stringify({email,password});
        try {
            const res = await axios.post("/api/auth/login",body,config);
            dispatch({
                type:"LOGIN_SUCCESS",
                token:res.data.token
            });

             dispatch(loadUser());
            
        } catch (err) {
            if(err.response.status=="400"){
                return "error"
            }
            console.log(err);
            dispatch({
                type:"LOGIN_FAIL"
            })
        }
    }
}

const joinStudent = ({invite_id})=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const body = JSON.stringify({invite_id});
        try {
            const res = await axios.post("/api/rooms/students/join",body,config);
            return res.data;
        } catch (err) {
            console.log(err);
            dispatch({
                type:"ERROR"
            })
        }
    }
}

const logout = ()=>{
    return async (dispatch)=>{
        try {
            await axios.post("/api/auth/logout");
            dispatch({
                type:"LOGOUT"
            });
        } catch (error) {
            console.log(error);
        }
    }
}

const loadUser= ()=>{
    return async (dispatch)=>{
        if(localStorage.token){
            setAuthToken(localStorage.token);
        }
        try {
            const res = await axios.get("/api/auth");
            dispatch({
                type:"USER_LOADED",
                user:res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type:"AUTH_ERROR"
            })
        }
    }
}

const updateAccount = ({name,phone})=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const body = JSON.stringify({name,phone});
        try {
            await axios.patch("/api/users",body,config);
            await dispatch(loadUser());
        } catch (err) {
            console.log(err);
              dispatch({
                type:"AUTH_ERROR"
            })
        }
    }
}

const changePassword = ({password,newPassword})=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }

        const body = JSON.stringify({password,newPassword});
        try {
            const res = await axios.patch("/api/users/password",body,config);
            return res.data;
            
        } catch (err) {
            console.log(err);
              dispatch({
                type:"ERROR"
            })
        }
    }
}

const deleteAccount = ()=>{
    return async (dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        try {
            const res = await axios.delete("/api/users/",config);
            dispatch({
                type:"LOGOUT"
            });
            return res.data;
            
        } catch (err) {
            console.log(err);
              dispatch({
                type:"ERROR"
            })
        }
    }

}

const sendOtp = (email) =>{
    return async(dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const body = JSON.stringify({email});
        try {
            const res = await axios.post("/api/auth/sendotp",body,config);
            dispatch({
                type:"FORGOT_PASSWORD",
                email:email
            });
            return res.data;
        } catch (err) {
            console.log(err);
              dispatch({
                type:"FORGOT_PASSWORD_ERROR"
            })
        }
    }
}

const resetPassword = (email,otp,newPassword)=>{
    return async(dispatch)=>{
        const config = {
            headers:{
                "Content-Type":"application/json"
            }
        }
        const body = JSON.stringify({email,otp,newPassword});
        try {
            const res = await axios.post("/api/auth/resetpassword",body,config);
            dispatch({
                type:"FORGOT_PASSWORD",
                email:""
            });
            return res.data;
        } catch (err) {
            console.log(err);
              dispatch({
                type:"FORGOT_PASSWORD_ERROR"
            })
        }
    }
}

const logoutAll = ()=>{
    return async (dispatch)=>{
        try {
            await axios.post("/api/auth/logoutAll");
            dispatch({
                type:"LOGOUT"
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export {register,loadUser,login,logout,joinStudent,updateAccount,changePassword,deleteAccount,sendOtp,resetPassword,logoutAll};

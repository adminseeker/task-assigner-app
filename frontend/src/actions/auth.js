import axios from "axios";

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
            dispatch({
                type:"REGISTER_SUCCESS",
                token:res.data.token
            });
            console.log(res);
        } catch (err) {
            console.log(err);
            dispatch({
                type:"REGISTER_FAIL"
            })
        }
    }
}

export {register};

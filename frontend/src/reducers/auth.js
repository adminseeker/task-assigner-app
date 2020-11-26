
const initialState = {
    token:localStorage.getItem("token"),
    isAuthenticated:null,
    loading:true,
    user:null,
    forgotPasswordEmail:""
};

const authReducer = (state=initialState,action)=>{
    switch(action.type){

        case "USER_LOADED":
            return{
                ...state,
                isAuthenticated:true,
                loading:false,
                user:action.user
            }

        case "REGISTER_SUCCESS":
        case "LOGIN_SUCCESS":
            localStorage.setItem("token",action.token);
            return{
                ...state,
                token:action.token,
                isAuthenticated:true,
                loading:false
            }
        case "FORGOT_PASSWORD":
            return{
                ...state,
                forgotPasswordEmail:action.email
            }
        case "FORGOT_PASSWORD_ERROR":
            return{
                ...state,
                forgotPasswordEmail:""
            }
            
        case "REGISTER_FAIL":
        case "AUTH_ERROR":
        case "LOGIN_FAIL":
        case "LOGOUT":
            localStorage.removeItem("token");
            return{
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false,
                forgotPasswordEmail:""
            }
        default:
            return state;
    }
}

export default authReducer;
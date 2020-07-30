
const initialState = {
    token:localStorage.getItem("token"),
    isAuthenticated:null,
    loading:true,
    user:null
};

const authReducer = (state=initialState,action)=>{
    switch(action.type){
        case "REGISTER_SUCCESS":
            localStorage.setItem("token",action.token);
            return{
                ...state,
                token:action.token,
                isAuthenticated:true,
                loading:false
            }
        case "REGISTER_FAIL":
            localStorage.removeItem("token");
            return{
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false
            }
        default:
            return state;
    }
}

export default authReducer;
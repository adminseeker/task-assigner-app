const initialState = {
    submissions:[],
    loading_submissions:true,
    error:""
};

const submissionsReducer = (state=initialState,action)=>{
    switch(action.type){
        case "GET_SUBMISSIONS":
            return {
                ...state,
                submissions:action.submissions,
                loading_submissions:false               
            }
        case "GET_SUBMISSIONS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_submissions:false
            }
        default:
            return state;
    }
}

export default submissionsReducer;
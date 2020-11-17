const initialState = {
    submissions:[],
    submittedStudents:[],
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
        case "GET_SUBMITTED_STUDENTS":
            return {
                ...state,
                submittedStudents:action.submittedStudents,
                loading_submissions:false               
            }
        case "GET_SUBMISSIONS_ERROR":
            return{
                ...state,
                error:action.error,
                loading_submissions:false
            }
        case "DELETE_SUBMISSION":
            return {
                ...state,
                submissions:state.submissions.filter((submission)=>((action.submission._id)!==(submission._id))),
                loading_submissions:false
            }
            case "DELETE_SUBMISSIONS_ERROR":
                return{
                    ...state,
                    error:action.error,
                    loading_submissions:false
                }
            case "LOGOUT":
                return{
                    ...initialState
                }
        default:
            return state;
    }
}

export default submissionsReducer;
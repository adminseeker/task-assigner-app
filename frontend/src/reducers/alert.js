const initialState = [];

const alertReducer = (state=initialState,action)=>{
    switch(action.type){
        case "SET_ALERT":
            return [...state, action.alert];
        case "REMOVE_ALERT":
            return state.filter((alert)=>(alert.id!==action.id));
        case "LOGOUT":
            return{
                ...initialState
            }
        default:
            return state;
    }
}

export default alertReducer;
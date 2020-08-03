import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from "../reducers/auth";
import alertReducer from "../reducers/alert";
import roomsReducer from "../reducers/rooms";
import submissionsReducer from "../reducers/submissions";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default ()=>{
    const store = createStore(
        combineReducers({
          auth: authReducer,
          alert:alertReducer,
          rooms:roomsReducer,
          submissions:submissionsReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    )
    return store;
};

import React, { useEffect } from "react";
import AppRouter from "./routers/AppRouter";
import configureStore from "./store/configureStore";
import {Provider} from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import {loadUser} from "./actions/auth";
import Alert from "./components/Alert";
import "./styles/styles.scss";

const store = configureStore();

if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = ()=>{
  useEffect(()=>{
    store.dispatch(loadUser());
  },[]);
  return(
    <div>
      <Provider store={store}>
        <Alert />
        <AppRouter />
      </Provider>
    </div>
  )
}

export default App;

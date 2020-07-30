import React from "react";
import AppRouter from "./routers/AppRouter";
import configureStore from "./store/configureStore";
import {Provider} from "react-redux";

const store = configureStore();

const App = ()=>{
  return(
    <div>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </div>
  )
}

export default App;

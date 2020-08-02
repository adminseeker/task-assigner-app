import React, { useEffect } from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";


const Dashboard = (props)=>{
    useEffect(()=>{
        props.dispatch(getRooms());
      },[props]);
    return(
        <div>
            <h1>Dashboard Page!</h1>
            <button onClick={(e)=>{
                props.dispatch(logout());
            }}>Logout</button><br/>

            

        </div>
    )
}

const mapStateToProps = (state)=>({
    auth:state.auth,
    rooms:state.rooms
})

export default connect(mapStateToProps)(Dashboard);
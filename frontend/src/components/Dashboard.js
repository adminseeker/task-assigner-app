import React, { useEffect } from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";
import RoomsList from "./RoomsList";

const Dashboard = ({getRooms,logout,auth:{auth},rooms:{rooms}})=>{
    useEffect(()=>{
        getRooms();
      },[getRooms]);
    return(
        <div>
            <h1>Dashboard Page!</h1>
            <button onClick={(e)=>{
                logout();
            }}>Logout</button><br/>            
            <RoomsList />
        </div>
    )
}

const mapStateToProps = (state)=>({
    auth:state.auth,
    rooms:state.rooms
})

export default connect(mapStateToProps,{getRooms,logout})(Dashboard);
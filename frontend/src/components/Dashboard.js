import React, { useEffect } from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";
import RoomsList from "./RoomsList";
import AddRoom from "./AddRoom";

const Dashboard = ({getRooms,logout,isTeacher})=>{
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
            <br />
            {
                isTeacher && <AddRoom />
            }
        </div>
    )
}

const mapStateToProps = (state)=>({
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps,{getRooms,logout})(Dashboard);
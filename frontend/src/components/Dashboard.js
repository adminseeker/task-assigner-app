import React, { useEffect } from "react";
import {logout} from "../actions/auth";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";
import RoomsList from "./RoomsList";
import AddRoom from "./AddRoom";
import LoadingPage from "./LoadingPage";

const Dashboard = ({getRooms,logout,user})=>{
    useEffect(()=>{
        getRooms();
      },[getRooms]);
      return (
      user==null ? <LoadingPage/>        
    :(
        <div>
            <h1>Dashboard Page!</h1>
            <button onClick={(e)=>{
                logout();
            }}>Logout</button>            
            <RoomsList /><br/>
            {
                user.isTeacher && <AddRoom />
            }
        </div>
    )
      )
}

const mapStateToProps = (state)=>({
    user:state.auth.user
})

export default connect(mapStateToProps,{getRooms,logout})(Dashboard);
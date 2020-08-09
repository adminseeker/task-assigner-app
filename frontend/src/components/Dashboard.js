import React, { useEffect } from "react";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";
import RoomsList from "./RoomsList";
import LoadingPage from "./LoadingPage";

const Dashboard = ({getRooms,user})=>{
    useEffect(()=>{
        getRooms();
      },[getRooms]);
      return (
      user==null ? <LoadingPage/>        
    :(
        <div>
            <h1 className="header__classrooms">Your Classrooms</h1>
            <div className="container">
                <div className="content-container">           
                    <RoomsList /><br/>
                    
                </div>
            </div>
        </div>
    )
      )
}

const mapStateToProps = (state)=>({
    user:state.auth.user
})

export default connect(mapStateToProps,{getRooms})(Dashboard);
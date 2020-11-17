import React from "react";
import RoomListItem from "./RoomListItem";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import AddRoom from "./AddRoom";

const RoomsList = (props) => {
    return (
        props.loading_rooms ? <LoadingPage /> :
        <div className="rooms-grid">
            {
                props.rooms.length === 0 ?(
                    <h3>No Classrooms</h3>
                ) : (
                    props.rooms.map((room)=>(
                        <RoomListItem key={room._id} room={room} user={props.user} teacher={props.teacher}/>
                    ))
                )
            }
            <div>
                {
                    props.user.isTeacher && <AddRoom />
                }
            </div>
        </div>
    )
}

const mapStateToProps= (state)=>({
    rooms:state.rooms.rooms,
    loading_rooms:state.rooms.loading_rooms,
    user:state.auth.user
})

export default connect(mapStateToProps)(RoomsList);
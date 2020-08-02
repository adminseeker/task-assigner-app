import React from "react";
import RoomListItem from "./RoomListItem";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";

const RoomsList = (props) => {
    return (
        props.loading_rooms ? <LoadingPage /> :
        <div>
            {
                props.rooms.length === 0 ?(
                    <h3>No Classrooms</h3>
                ) : (
                    props.rooms.map((room)=>(
                        <RoomListItem key={room._id} room={room}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state)=>({
    rooms:state.rooms.rooms,
    loading_rooms:state.rooms.loading_rooms
})

export default connect(mapStateToProps)(RoomsList);
import React from "react";
import RoomListItem from "./RoomListItem";
import { connect } from "react-redux";

const RoomsList = (props) => {
    return (
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
    rooms:state.rooms.rooms
})

export default connect(mapStateToProps)(RoomsList);
import React from "react";
import { connect } from "react-redux";


const Room = (props) => {
    return (
        <div>
            <h1>{props.room.className}</h1>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id))
})

export default connect(mapStateToProps)(Room);
import React from "react";
import ResorcesListItem from "./ResourcesListItem";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";

const ResourcesList = (props) => {
    return (
        props.loading_rooms ? <LoadingPage /> :
        <div>
            {
                props.room.resources.length === 0 ?(
                    <h3>No Resources</h3>
                ) : (
                    props.room.resources.map((resource)=>(
                        <ResorcesListItem key={resource.createdAt} room_id={props.room._id} resource={resource}/>
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.url_id)),
    loading_rooms:state.rooms.loading_rooms
})

export default connect(mapStateToProps)(ResourcesList);
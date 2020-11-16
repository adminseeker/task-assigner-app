import React, { useEffect } from "react";
import ResorcesListItem from "./ResourcesListItem";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import { getTeacherResources } from "../actions/rooms";
import Uploader from "./Uploader";

const ResourcesList = ({room:{_id},getTeacherResources,resources,loading_resources,isTeacher}) => {
    useEffect(()=>{
        getTeacherResources(_id)
    },[getTeacherResources,_id])
    return (
        loading_resources ? <LoadingPage /> : 
        <div>
            {
                resources.length === 0 ?(
                    <h3>No Assignments</h3>
                ) : (
                    resources.map((resource)=>(
                        <ResorcesListItem key={resource._id} room_id={_id} resource={resource} isTeacher={isTeacher}/>
                    ))
                )
            }
            <h2>Add Assignments</h2>
            <Uploader room_id={_id} isTeacher={isTeacher}/>
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    loading_resources:state.rooms.loading_resources,
    resources:state.rooms.resources,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps,{getTeacherResources})(ResourcesList);
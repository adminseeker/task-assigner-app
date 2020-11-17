import React, { useEffect } from "react";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import { getMaterials } from "../actions/rooms";
import Uploader from "./Uploader";
import MaterialsListItem from "./MaterialsListItem";

const MaterialsList = ({room:{_id},getMaterials,materials,loading_materials,isTeacher}) => {
    useEffect(()=>{
        getMaterials(_id)
    },[getMaterials,_id])
    return (
        loading_materials ? <LoadingPage /> : 
        <div>
            {
                materials.length === 0 ?(
                    <h3>No Materials</h3>
                ) : (
                    materials.map((material)=>(
                        <MaterialsListItem key={material._id} room_id={_id} material={material} isTeacher={isTeacher}/>
                    ))
                )
            }
            {isTeacher && <h2>Add Materials</h2>}
            {isTeacher && <Uploader room_id={_id} isTeacher={isTeacher} isMaterial={true}/>}
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    room: state.rooms.rooms.find((room)=>(room._id === props.match.params.id)),
    loading_materials:state.rooms.loading_materials,
    materials:state.rooms.materials,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps,{getMaterials})(MaterialsList);
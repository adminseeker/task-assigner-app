import React, { useEffect } from "react"
import SubmissionsList from "./SubmissionsList";
import { getSubmissions } from "../actions/submissions";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import Uploader from "./Uploader";

const Submissions = ({getSubmissions, room_id,loading_submissions}) => {
    useEffect(()=>{
        getSubmissions(room_id)
    },[getSubmissions,room_id]);
    return (
        loading_submissions ? <LoadingPage /> :
        <div>
            <h3>My Submissions:</h3>
            <SubmissionsList room_id={room_id}/>
            <h3>Upload: </h3>
            <Uploader room_id={room_id}/>
        </div>
    )
}

const mapStateToProps = (state,props)=>({
    room_id: state.rooms.rooms.find((room)=>(room._id === props.match.params.id))._id,
    loading_submissions:state.submissions.loading_submissions
})

export default connect(mapStateToProps,{getSubmissions})(Submissions);
import React, { useEffect } from "react";
import { connect } from "react-redux";
import LoadingPage from "./LoadingPage";
import AnnouncementListItem from "./AnnouncementListItem";
import { getAnnouncements } from "../actions/rooms";

const AnnouncementsList = ({loading_announcements,announcements,room_id,isTeacher,getAnnouncements}) => {
    return (
        loading_announcements ? <LoadingPage /> :
        <div>
            {
                announcements.length === 0 ?(
                    <h3>No Announcements</h3>
                ) : (
                    announcements.map((announcement)=>(
                        <AnnouncementListItem key={announcement._id} room_id={room_id} announcement={announcement} isTeacher={isTeacher} />
                    ))
                )
            }
        </div>
    )
}

const mapStateToProps= (state,props)=>({
    announcements:state.rooms.announcements,
    loading_announcements:state.rooms.announcements.loading_announcements,
    isTeacher:state.auth.user.isTeacher
})

export default connect(mapStateToProps,{getAnnouncements})(AnnouncementsList);
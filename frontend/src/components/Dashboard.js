import React, { useEffect } from "react";
import {connect} from "react-redux";
import {getRooms} from "../actions/rooms";
import RoomsList from "./RoomsList";
import LoadingPage from "./LoadingPage";
import useSWR from "swr";
import { Grid, Container, Typography } from "@material-ui/core";

const Dashboard = ({getRooms,user})=>{
    useEffect(()=>{
        getRooms();
      },[getRooms,user]);
      return (
      user==null ? <LoadingPage/>        
    :(
        <div>
            <Typography variant="h2" align="center">
                Classrooms
            </Typography>
            <Container >
            <RoomsList />
            </Container>
                
        </div>
    )
      )
}

const mapStateToProps = (state)=>({
    user:state.auth.user
})

export default connect(mapStateToProps,{getRooms})(Dashboard);
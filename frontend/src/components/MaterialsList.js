import React, { useEffect } from "react";
import { connect } from "react-redux";
import FacebookCircularProgress from "./FacebookCircularProgress";
import { getMaterials } from "../actions/rooms";
import Uploader from "./Uploader";
import MaterialsListItem from "./MaterialsListItem";

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1), //grid padding
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },fab: {
      margin: theme.spacing(2),
  
    },
    fixed: {
      position: 'fixed',
      bottom: theme.spacing(4),
      right: theme.spacing(4),
    },
  }));

const MaterialsList = ({room:{_id},getMaterials,materials,loading_materials,isTeacher}) => {
    useEffect(()=>{
        getMaterials(_id)
    },[getMaterials,_id])
    
    const classes = useStyles();
    return (
        loading_materials ? <FacebookCircularProgress /> :
        <div>
        <Typography variant="h2" align="center">
                Materials
            </Typography>
        <Container >
        <div className={classes.root}>
            <Grid container xs={12} spacing={3}>
                {
                    materials.length === 0 ?(
                        <h3>No Materials</h3>
                    ) : (
                        materials.map((material)=>(
                            <Grid item xs={12} md={6} lg={4} >
                                <MaterialsListItem key={material._id} room_id={_id} material={material} isTeacher={isTeacher}/>
                            </Grid>
                        ))
                    )
                }
                
            
            </Grid>
      
                {isTeacher && <Uploader room_id={_id} isTeacher={isTeacher} isMaterial={true}/>}
        </div>
        </Container> 
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
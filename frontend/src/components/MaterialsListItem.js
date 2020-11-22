import React, { useState } from "react";
import moment from "moment";
import { deleteMaterial } from "../actions/rooms";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    }
  });

const MaterialsListItem = (props)=>{
    const classes = useStyles();
    return (
        <Card className={classes.root}>
        <CardActionArea>
        <a href={props.material.material} target="_blank" rel="noopener noreferrer">
        <CardMedia
          component="img"
          alt={props.material._id}
          height="120"
          image="/images/book.jpg"
          title={props.material.description}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" color="primary">
          {props.material.description}
          <Typography variant="body" color="textSecondary" component="p">
            Added on {moment(props.material.createdAt).format('MMM D, YYYY')}
          </Typography>
          </Typography>
        </CardContent>
        </a>
      </CardActionArea>
      <CardActions>
      {props.isTeacher && <Button size="small" color="secondary" onClick={async (e)=>{props.dispatch(deleteMaterial(props.room_id,props.material._id))}}>Remove</Button>}
      </CardActions>
    </Card>
    );
}


export default connect()(MaterialsListItem);


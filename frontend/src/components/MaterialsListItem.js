import React, { useState } from "react";
import moment from "moment";
import { deleteMaterial } from "../actions/rooms";
import { connect } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    }
  });

const MaterialsListItem = (props)=>{
  const [open, setOpen] = useState(false);
    const handleDelete = async (e)=>{
      setOpen(false);
      await props.dispatch(deleteMaterial(props.room_id,props.material._id))
    }
    
    const handleClose = () => {
      setOpen(false);
    };
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
      {props.isTeacher && <Button size="small" color="secondary" onClick={async (e)=>{setOpen(true)}}>Remove</Button>}
      </CardActions>
      <Dialog
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{<Typography variant="h4">Are you sure you want to remove this material?</Typography>}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      {<Typography variant="h5">This material will be deleted permanently!</Typography>}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose} color="primary">
      No
    </Button>
    <Button onClick={handleDelete} color="secondary" autoFocus>
      Yes
    </Button>
  </DialogActions>
</Dialog>
    </Card>
    );
}


export default connect()(MaterialsListItem);


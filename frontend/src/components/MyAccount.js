import React, { useState, useEffect } from "react";
import {register,updateAccount} from "../actions/auth";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {setAlert} from "../actions/alert";
import {useHistory} from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  resize:{
    fontSize:16
}
}));

const MyAccount = (props)=>{
  const classes = useStyles();
  const hist = useHistory();

  const [formData,setFormData] = useState({
    firstName:props.user.name.split(" ")[0],
    lastName:props.user.name.split(" ")[1],
    email:props.user.email,
    phone:props.user.phone
});

const [emailError,setEmailError] = useState("")
const [passwordError,setPasswordError] = useState("")
const [phoneError,setPhoneError] = useState("")

const {firstName,lastName,email,phone} = formData;



const onChange = (e)=>{
    setFormData({...formData , [e.target.name]:e.target.value})
}

const onSubmit = async (e)=>{
    e.preventDefault();
    if(!(/^[+]?(?:\d| ){10,}$/.test(phone))){
        setPhoneError("Enter Valid phone number!")
    }
    else{
        await props.dispatch(updateAccount({name:firstName+" "+lastName,phone}));
        alert("Updated Account Details!");
        hist.push("/dashboard");       
    }
}

const handleChangePassword = (e)=>{
    e.preventDefault();
    hist.push("/changepassword");
}

  return (
    <Container component="main" maxWidth="xs">

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          User Account
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={onChange}
                InputProps={{
                    classes: {
                      input: classes.resize
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={onChange}
                value={lastName}
                InputProps={{
                    classes: {
                      input: classes.resize
                    },
                  }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="email"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                error={!!emailError}
                disabled={true}
                helperText={!!emailError ? "Email Already Registered!" : ""}
                InputProps={{
                    classes: {
                      input: classes.resize
                    },
                  }}
              />
            </Grid>
          <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                type="tel"
                error={!!phoneError}
                helperText={!!phoneError ? phoneError : ""}
                id="phone"
                label="Phone"
                name="phone"
                value={phone}
                autoComplete="phone"
                onChange={onChange}
                InputProps={{
                    classes: {
                      input: classes.resize
                    },
                  }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
          <Box fontSize={16}>
          Update

         </Box>
          </Button>
          <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleChangePassword}
        >
        <Box fontSize={16}>
        Change Password
       </Box>
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          
        >
        <Box fontSize={16}>
        Delete Account
       </Box>
        </Button>
        </form>
      </div>
    </Container>
  );
}

const mapStateToProps = (state,props)=>({
    isAuthenticated:state.auth.isAuthenticated,
    user:state.auth.user
})

export default connect(mapStateToProps)(MyAccount);
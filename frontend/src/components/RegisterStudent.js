import React, { useState } from "react";
import {register} from "../actions/auth";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import {setAlert} from "../actions/alert";

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

const RegisterStudent = (props)=>{
  const classes = useStyles();

  const [formData,setFormData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    password2:"",
    isTeacher:false,
    phone:""
});

const [emailError,setEmailError] = useState("")
const [passwordError,setPasswordError] = useState("")
const [phoneError,setPhoneError] = useState("")

if(props.isAuthenticated){
    return <Redirect to="/dashboard" />
}


const {firstName,lastName,email,password,password2,isTeacher,phone} = formData;



const onChange = (e)=>{
    setFormData({...formData , [e.target.name]:e.target.value})
}

const onSubmit = async (e)=>{
    e.preventDefault();
    if(password!==password2){
        setPasswordError("Passwords do not match");
    }else if(!(/^[+]?(?:\d| ){10,}$/.test(phone))){
        setPhoneError("Enter Valid phone number!")
    }
    else{
        const res = await props.dispatch(register({name:firstName+" "+lastName,email,password,isTeacher,phone}));
        if(res=="Email already registered!"){
            setEmailError(res);
        }
    }
}

  return (
    <Container component="main" maxWidth="xs">

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register As Student
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
                onChange={onChange}
                error={!!emailError}
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChange}
                error={!!passwordError}
                helperText={!!passwordError ? "Passwords Do not Match!" : ""}
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
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="current-password"
                onChange={onChange}
                error={!!passwordError}
                helperText={!!passwordError ? "Passwords Do not Match!" : ""}
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
          Register

         </Box>
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="h6">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

const mapStateToProps = (state,props)=>({
    isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps)(RegisterStudent);
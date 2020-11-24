import React, { useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import { getRooms } from "../actions/rooms";
import FacebookCircularProgress from "./FacebookCircularProgress";
import {useHistory} from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Button, Container, Link, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 0.8,
    margin: 5
  },
}));

const Header = ({user,isAuthenticated,logout,history}) => {
    useEffect(()=>{
        getRooms()
    },[]);
  const hist = useHistory(); 
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTeacherOption = () => {
    hist.push("/register/teacher");
    setAnchorEl(null);
  };

  const handleStudentOption = () => {
    hist.push("/register/student");
    setAnchorEl(null);
  };

  const handleLoginButton = () => {
    hist.push("/login");
  };

  const handleDashboard = () => {
    hist.push("/dashboard");
  };

  const handleMyAccount = () => {
    hist.push("/dashboard");
  };

  const handleJoinClassroom = () => {
    hist.push("/join");
  };

  const handleLogout = () => {
    hist.push("/logout");
    setAnchorEl(null);
  };

  return user==null && isAuthenticated ? <FacebookCircularProgress/> : (
    <div className={classes.root}>
      <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
        
        <Typography variant="h4" className={classes.title}>
            <Link color="inherit" underline="none" href={"/"}>
            Tasker
            </Link>
          </Typography>
          {!isAuthenticated && (
            <div>
              <Button
                aria-label="Register"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <Box fontSize={14}>
                    Register
                </Box>
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleStudentOption}>Student</MenuItem>
                <MenuItem onClick={handleTeacherOption}>Teacher</MenuItem>
              </Menu>
              <Button
                aria-label="Login"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleLoginButton}
                color="inherit"
              >
              <Box fontSize={14}>
                    Login
                </Box>
              </Button>
              
            </div>
          )}
          {isAuthenticated && (
            <div>
            <Button
                onClick={handleDashboard}
                color="inherit"
              >
                <Box fontSize={12}>
                    Dashboard
                </Box>
              </Button>
              <Button
                aria-label="User Account"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <Box fontSize={12}>
                {user.name}
                </Box>
                
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
              
            </div>
          )}
           
        </Toolbar>
        </Container> 
      </AppBar>
    </div>
  );
}

const mapStateToProps = (state)=>({
    isAuthenticated:state.auth.isAuthenticated,
    user:state.auth.user
})

export default connect(mapStateToProps,{logout})(Header);
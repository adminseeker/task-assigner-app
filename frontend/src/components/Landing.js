import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Button, Card, Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Redirect, Link } from "react-router-dom";
import { AccessAlarm, Book ,MenuBook, Announcement} from "@material-ui/icons";

const styles = (theme) => ({
    background: {
        backgroundImage: `url(/images/photo-stock-class.jpeg)`,
        backgroundSize: "cover",
        backgroundColor: "#7fc7d9", // Average color of the background image.
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justify: "center",
    },
    rempad: {
        paddingTop: "4rem",
    },
    rempadlot: {
        paddingTop: "10rem",
    },
    markedH2Center: {
        margin: `${theme.spacing(1)}px auto 0`,
        fontWeight: 100,
        textAlign: "center",
        paddingBottom: 0,
    },
    fillIn: {
        margin: "auto",
    },
    whiteText: {
        color: "#eee",
    },
    underliner: {
        width: "5rem",
        height: "5px",
        margin: "auto",
        backgroundColor: theme.palette.secondary.main,
    },
    italizer: {
        fontStyle: "italic",
    },
    buttonContainer: {
        padding: "4rem",
        display: "flex",
        justifyContent: "center",
        justify: "center",
    },
    "@media (max-width: 768px)": {
        buttonContainer: {
            flexDirection: "column",
        },
    },
    "@media (max-width: 512px)": {
        cardContainer: {
            flexDirection: "column",
        },
    },
    button: {
        fontSize: "1.6rem",
        padding: "1.5rem 3rem",
        margin: "1rem",
    },
    bigText: {
        fontSize: "3rem",
    },
    card: {
        width: "20rem",
        margin: "1rem auto ",
        padding: "1.5rem",
    },
    cardContainer: {
        padding: "4rem",
        display: "flex",
        justifyContent: "center",
        justify: "center",
        backgroundImage: `url(/images/curvy.png)`,
        backgroundSize: "stretch",
    },
    cardContent:{
        textAlign:'center'
    },
    cardMedia:{
        textAlign: "center",
        width:'100%',
        fontSize: "6rem"
    },
    centerer:{
        textAlign: "center"
    }
});

const content = [
    {
        pic: AccessAlarm,
        header: "Assignments",
        content: "Manage your assignments",
    },
    {
        pic: MenuBook,
        header: "Material",
        content: "Recieve and manage material for courses",
    },
    {
        pic: Announcement,
        header: "Notifications",
        content: "Recieve announcements for courses",
    },
    
];

const Landing = (props) => {
    const { classes } = props;
    const bull = <span className={classes.bullet}>•</span>;
    return (
        <>
            <div className={classes.background}>
                <div className={classes.rempad}></div>
                <h1
                    className={`${classes.markedH2Center} ${classes.whiteText}`}
                >
                    Tasker
                </h1>
                <div className={classes.underliner}></div>
                <div className={classes.rempad}></div>
                <div
                    className={`${classes.fillIn} ${classes.whiteText} ${classes.italizer} ${classes.centerer}`}
                >
                    “Online learning is not the next big thing, it is the new big thing.” ~ Donna J. Abernathy
                </div>
                <div className={`${classes.buttonContainer} ${classes.fillIn}`}>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/register/teacher"
                    >
                        Register (Teacher){" "}
                    </Button>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/register/student"
                    >
                        Register (Student){" "}
                    </Button>
                </div>
                <div
                    className={`${classes.fillIn} ${classes.whiteText} ${classes.bigText}`}
                >
                    &dArr;
                </div>
            </div>
            <Container className={`${classes.rempad} ${classes.cardContainer}`}>
                {content.map((e, i) => {
                    return (
                        <Card
                            variant="outlined"
                            key={i}
                            className={classes.card}
                        >
                            <CardMedia
                                className={classes.cardMedia}
                                component={e.pic}
                                title="Paella dish"
                            />
                            <CardContent >
                                <Typography variant="h4" component="h2"className={classes.cardContent}>
                                    {e.header}
                                </Typography>
                                <Typography variant="h5" component="p">
                                    {e.content}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Container>
        </>
    );
};

Landing.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);

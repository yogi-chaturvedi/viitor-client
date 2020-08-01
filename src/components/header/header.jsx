import React, {useEffect} from 'react';
import {Grid, makeStyles, Tab, Tabs, withStyles} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {useHistory} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import _ from "lodash";

function ElevationScroll(props) {
    const {children, window} = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
    });
}

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        marginRight: 10
    },
    logo: {
        width: 65,
        height: 45
    },
    toolbar: {
        background: "black"
    },
    logoutContainer: {
        display: "flex",
        flex:1,
        justifyContent:"flex-end"
    }
}));
const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        //   justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            // maxWidth: 40,
            width: '100%',
            backgroundColor: 'yellow',
        },
    },
})((props) => <Tabs {...props} TabIndicatorProps={{children: <span/>}}/>);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: '#fff',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        opacity: 1,
        '&:focus': {
            outline: "none",
        },
        '&$selected': {
            color: 'yellow',
            fontWeight: theme.typography.fontWeightMedium,
        },
    },
}))((props) => <Tab disableRipple {...props} />);


const Nav = ({tabIndex, changeTab}) => {
    let history = useHistory();
    const tabs = [
        {label: "Home", route: "app/dashboard"},
        {label: "Create Patient", route: "app/patient"}
    ]
    return <Grid>
        <StyledTabs
            onChange={(e, tabIndex) => {
                const selectedTab = tabs[tabIndex]
                changeTab(tabIndex);
                history.push(`/${selectedTab.route}`)
            }}
            variant="fullWidth"
            value={tabIndex}
            aria-label="Navigation Tabs">
            {
                tabs.map((tab) => {
                    return <StyledTab key={tab.label} label={tab.label}/>
                })
            }
        </StyledTabs>
    </Grid>
};


export default function AppHeader(props) {
    const classes = useStyles();
    const history = useHistory();
    const [value, setValue] = React.useState(0);

    const logout = () => {
        localStorage.clear();
        history.push("/");
    };

    useEffect(()=>{
        console.log("history", history);
        if(_.includes(history.location.pathname, "app/dashboard")){
            setValue(0);
        } else if(_.includes(history.location.pathname, "app/patient")){
            setValue(1);
        }
    });

    return (
        <React.Fragment>
            <CssBaseline/>
            <ElevationScroll {...props}>
                <AppBar>
                    <Toolbar className={classes.toolbar}>
                        <img
                            className={classes.logo}
                            src={
                                "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
                            }
                            alt="Logo"/>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Doctors Portal
                        </Typography>
                        <Nav {...props} changeTab={setValue} tabIndex={value}/>
                        <div className={classes.logoutContainer}>
                            <Button color="primary" variant="contained" onClick={logout}>Logout</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Toolbar/>
        </React.Fragment>
    );
}

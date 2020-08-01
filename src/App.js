import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { Route, matchPath, withRouter } from 'react-router-dom';
import "./app.scss";
import Dashboard from './components/dashboard/dashboard';
import AppHeader from './components/header/header';
import { Patient } from './components/patient/patient';
import { PrivateRoute } from './util';
import { Hidden } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		margin: 10,
		[theme.breakpoints.down('xs')]: {
			paddingBottom: 56,
		},
	},
	body: {

	}
}));

const App = (props) => {
	const classes = useStyles();
	return (
		<>
			<div className={`app-body ${classes.root}`}>
				<Hidden only='xs'>
					<AppHeader/>
				</Hidden>
				<section className={classes.body}>
					<PrivateRoute path={`${props.match.path}/dashboard`} component={Dashboard} />
					<PrivateRoute exact path={`${props.match.path}/patient`} component={Patient} />
					<PrivateRoute exact path={`${props.match.path}/patient/:id`} component={Patient} />
				</section>
			</div>
		</>
	);
}
export default withRouter(App);

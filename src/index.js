import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router-dom';
import {createBrowserHistory} from "history";
import {Login} from './components/login/login.jsx';
import {SignUp} from './components/login/signup.jsx';
import App from './App';
import {createMuiTheme, responsiveFontSizes, ThemeProvider} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import {ToastContainer} from 'react-toastify';
import {PrivateRoute} from './util';

import "font-awesome/scss/font-awesome.scss"
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';

const history = createBrowserHistory();

let theme = createMuiTheme({
	palette: {
		primary: blue,
	},
	props: {
	  MuiButton: {
		size: 'small',
	  },
	  MuiFilledInput: {
		margin: 'dense',
	  },
	  MuiFormControl: {
		margin: 'dense',
	  },
	  MuiFormHelperText: {
		margin: 'dense',
	  },
	  MuiIconButton: {
		size: 'small',
	  },
	  MuiInputBase: {
		margin: 'dense',
	  },
	  MuiInputLabel: {
		margin: 'dense',
	  },
	  MuiListItem: {
		dense: true,
	  },
	  MuiOutlinedInput: {
		margin: 'dense',
	  },
	  MuiFab: {
		size: 'small',
	  },
	  MuiTable: {
		size: 'small',
	  },
	  MuiTextField: {
		margin: 'dense',
	  },
	  MuiToolbar: {
		variant: 'dense',
	  },
	},
	overrides: {
	  MuiIconButton: {
		sizeSmall: {
		  marginLeft: "4px",
		  marginRight: "4px",
		  padding: "12px",
		},
	  },
	},
});
theme = responsiveFontSizes(theme);

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<React.StrictMode>
			<ToastContainer
				position="top-center"
				autoClose={6000}
				closeButton={false}/>
				<Router history={history}>
					<Switch>
						<Route path="/signup" component={SignUp} />
						<PrivateRoute path="/app" component={App}/>
						<Route exact path="/" component={Login} />
					</Switch>
				</Router>
		</React.StrictMode>
  	</ThemeProvider>,
  document.getElementById('root')
);

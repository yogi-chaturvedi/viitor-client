import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {Link, useHistory} from 'react-router-dom';
import loginService from '../../services/login.service';
import {toast} from "react-toastify";
import _ from "lodash";
import "../../index.scss";
import WithLoader from "../hoc/WithLoader";

const ButtonWithLoader = WithLoader(Button);

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    loginWrapper: {
        margin: "auto !important",
        borderRadius: 5
    }
}));

const INITIAL_STATE = {
    email: "", password: ""
};

export const Login = () => {
    const classes = useStyles();
    let history = useHistory();
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0;
            if (noErrors) {
                console.log("Ready to go", values.email, values.password);
            }
            setSubmitting(false);
        }
    }, [errors]);

    const handleChange = (event) => {
        const newValues = {
            ...values,
            [event.target.name]: event.target.value
        };
        setValues(newValues);
        console.log("New Values", newValues)
    }

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setSubmitting(true);
    }

    const validate = () => {
        let errors = {};
        // Email Errors
        if (!values.email) {
            errors.email = "Required Email";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Invalid email address";
        }
        // Password Errors
        if (!values.password) {
            errors.password = "Required Password";
        } else if (values.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        return errors;
    };

    const onSubmit = (event) => {
        handleSubmit(event);
        console.log(errors);
        if (_.isEmpty(errors)) {
            setLoading(true);
            loginService.login({
                email: values.email,
                password: values.password,
                strategy: "local"
            })
                .then(async (data) => {
                    await localStorage.setItem("accessToken", data.accessToken);
                    await localStorage.setItem("user", JSON.stringify(data.user));
                    setLoading(false);
                    history.push("/app/dashboard")
                })
                .catch((error) => {
                    setLoading(false);
                    toast.error(error.message);
                });
        }
    };

    return (
        <Grid container component="main" className={`${classes.root} ${classes.image}`}>
            <CssBaseline/>
            <Grid item lg={4} component={Paper} elevation={6} className={classes.loginWrapper}
                  square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        {errors.email && <div className="field-error">{errors.email}</div>}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {errors.password && <div className="field-error">{errors.password}</div>}
                        <ButtonWithLoader
                            loading={loading}
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={onSubmit}
                            disabled={isSubmitting}
                            color="primary">
                            Sign In
                        </ButtonWithLoader>
                        <Link to="/signup" variant="body2">
                            {"Don't have an account?"}
                        </Link>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}

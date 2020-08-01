import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import commonService from "../../services/common.service";
import loginService from "../../services/login.service";
import _ from "lodash";
import "../../index.scss";
import {toast} from 'react-toastify';
import {FormDropDown, FormPassword, FormTextField} from "./fields";

const useStyles = makeStyles((theme) => ({
    root: {
        // height: '100vh'
    },
    paper: {
        // marginTop: theme.spacing(8),
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
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    signupWrapper: {
        margin: "25px auto"
    }
}));

export const SignUp = () => {
    const classes = useStyles();
    let history = useHistory();

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [dropDowns, setDropDowns] = useState({});
    const [schema, setSchema] = useState([]);

    useEffect(() => {
        commonService.getUserSchema()
            .then(data => {
                console.log("schema", data);
                setSchema(data.data);
                _.forEach(data.data, field => {
                        if (field.apiUrl && !field.derivedFrom) {
                            commonService.getData(field.apiUrl)
                                .then(res => {
                                    setDropDowns({...dropDowns, [field.id]: res.data});
                                });
                        }
                    }
                )
            })
            .catch(error => {
                console.log("Error in fetching schema", error)
            })
    }, []);

    const handleChange = (event) => {
        const newValues = {
            ...values,
            [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
        };
        setValues(newValues);
        console.log("New Values", newValues)
    };

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };

    const validate = (values) => {
        const fieldErrors = {};
        _.forEach(schema, field => {
            if (field.required) {
                if (!values[field.id]) {
                    fieldErrors[field.id] = `${field.label} is required`;
                    return;
                }
            }
            if (field.min) {
                if (values[field.id] && values[field.id].length >= field.min) {
                    // do nothing
                } else {
                    fieldErrors[field.id] = `${field.label} less than min`;
                    return;
                }
            }
            if (field.max) {
                if (values[field.id] && values[field.id].length <= field.max) {
                    // do nothing
                } else {
                    fieldErrors[field.id] = `${field.label} greater than max`;
                    return;
                }
            }
            if (field.regex) {
                if (values[field.id] && new RegExp(field.regex).test(values[field.id])) {
                    // do nothing
                } else {
                    fieldErrors[field.id] = `${field.label} does not match patterns`;
                }
            }
        });
        return fieldErrors;
    };


    const onSubmit = (event) => {
        console.log(errors);
        event.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (_.isEmpty(validationErrors)) {

            const payload = {};
            schema.forEach(field => {
                payload[field.id] = values[field.id];
            });

            loginService.signUp(payload)
                .then(() => {
                    toast.success("Signup successfully");
                    history.push("/");
                })
                .catch((error) => {
                    console.log("Error in signing up", error);
                })
        } else {
            toast.error("Cant submit. Form has error");
        }
    };

    const fieldChanged = ({target: {name, value}}) => {
        const newValues = {...values};
        newValues[name] = value;
        if (name === "country") {
            newValues.state = "";
            newValues.city = "";
        } else if (name === "state") {
            newValues.city = "";
        }
        handleChange({target: {name, value}});
        setValues(newValues)
        const matched = schema.find(c => {
            return c.derivedFrom === name;
        });
        if (matched) {
            commonService.getData(`${matched.apiUrl}?${name}=${value}`)
                .then(data => {
                    setDropDowns({...dropDowns, [matched.id]: data.data});
                });
        }
    };

    return (
        <Grid container component="main" className={`${classes.root} ${classes.image}`}>
            <CssBaseline/>
            <Grid item md={5} component={Paper} elevation={6} className={classes.signupWrapper} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        <Grid container spacing={2}>
                            {
                                schema.map((field) => {
                                    if (field.type === "text") {
                                        return <FormTextField
                                            field={field}
                                            fieldChanged={fieldChanged}
                                            handleBlur={handleBlur}
                                            values={values}
                                            errors={errors}/>
                                    } else if (field.type === "drop-down") {
                                        return <FormDropDown
                                            field={field}
                                            fieldChanged={fieldChanged}
                                            handleBlur={handleBlur}
                                            values={values}
                                            dropDowns={dropDowns}
                                            errors={errors}/>
                                    } else if (field.type === "password") {
                                        return <FormPassword
                                            field={field}
                                            fieldChanged={fieldChanged}
                                            handleBlur={handleBlur}
                                            values={values}
                                            errors={errors}/>
                                    }
                                })
                            }
                            <Grid xs={6} sm={6} md={6} item>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}>
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end">
                            <Grid xs={12} sm={6} md={6} item style={{textAlign: "right"}}>
                                <Link to="/" variant="body2">Already have an account?</Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

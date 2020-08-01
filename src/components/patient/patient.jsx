import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper";
import _ from "lodash";
import {toast} from "react-toastify";
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import Typography from "@material-ui/core/Typography";
import commonService from "../../services/common.service";
import PatientService from "../../services/patient.service";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import {useHistory, useParams} from "react-router";
import WithLoader from "../hoc/WithLoader";

const ButtonWithLoader = WithLoader(Button);

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        margin:"auto",
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        margin: theme.spacing(6, 4),
        display: 'flex',
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
    }
}));

const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    age: null,
    gender: "Other",
    diagnoseWith: "",
    remarks: "",
    country: "",
    state: "",
    city: ""
};

export const Patient = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const { match } = props;
    const patientService = new PatientService();
    let {id: patientId} =  useParams();;
    console.log(patientId);

    const [patient, setPatient] = useState(initialState)
    const [errors, setErrors] = useState(initialState)
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let current = true;
        commonService.getCountries()
            .then((response) => {
                let countries = response.data.map((country) => {
                    return { id: country, name: country, label: country };
                })
                setCountries(countries);
            })
            .catch((error) => {
            });
        return () => {
            current = false;
        }
    }, []);

    useEffect(() => {
        patientService.get(patientId)
            .then((resp) => {
                setPatient(resp.data);
            })
    }, []);

    useEffect(() => {
        let current = true;
        if (patient.country) {
            commonService.getStates(patient.country)
                .then((response) => {
                    let states = response.data.map((state) => {
                        return { id: state, name: state, label: state };
                    })
                    setStates(states);
                })
                .catch((error) => {

                })
        } else {
            setStates([]);
            setCities([]);
        }
        return () => {
            current = false;
        }
    }, [patient.country]);

    useEffect(() => {
        let current = true;
        if (patient.state) {
            commonService.getCities(patient.state, patient.country)
                .then((response) => {
                    let cities = response.data.map((city) => {
                        return { id: city, name: city, label: city };
                    })
                    setCities(cities);
                })
                .catch((error) => {

                })

        } else {
            setCities([]);
        }
        return () => {
            current = false;
        }
    }, [patient.state]);

    const handleChange = (event) => {
        const newValues = {
            ...patient,
            [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value
        };
        setPatient(newValues);
        console.log("New patient", newValues)
    }

    const handleBlur = () => {
        const validationErrors = validate(patient);
        setErrors(validationErrors);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = validate(patient);
        setErrors(validationErrors);
    }

    const validate = () => {
        let errors = {};
        // Email Errors
        if (!patient.email) {
            errors.email = "Required Email";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(patient.email)) {
            errors.email = "Invalid email address";
        }
        // Password Errors
        if (!patient.password) {
            errors.password = "Required Password";
        } else if (patient.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        return errors;
    };

    const onSubmit = (event) => {
        handleSubmit(event);
        if(!_.isEmpty(errors)){
            toast.error('Form has some errors');
            return;
        }
        if (_.isEmpty(errors)) {
            let response;
            if (patientId) {
                response = patientService.update(patientId, patient);
            } else {
                response = patientService.create(patient)
            }
            setLoading(true);
            response.then((data) => {
                history.push("/app/dashboard");
                toast.success("Patient created successfully")
                setLoading(false);
            }).catch((error) => {
                toast.error(error.message);
                setLoading(false);
            });
        }
    };

    return <Grid container component="main" className={`${classes.root}`}>
        <CssBaseline/>
        <Grid item xs={11} sm={8} md={5} lg={6} component={Paper} elevation={6} square>
            <div className={classes.paper}>

                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Typography component="h1" variant="h5" style={{marginBottom: 10}}>
                        { patientId ?  "Update" : "Create"} patient
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                required
                                id="firstName"
                                onChange={handleChange}
                                fullWidth
                                onBlur={handleBlur}
                                value={patient.firstName}
                                label="First Name"
                                name="firstName"
                            />
                        </Grid>
                        <Grid lg={6} item>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={patient.lastName}
                                label="Last Name"
                                name="lastName"
                            />
                        </Grid>
                    </Grid>
                    <Grid lg={12} item>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={patient.email}
                            label="Email"
                            name="email"
                        />
                    </Grid>
                    <Grid lg={12} item>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="contact"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={patient.contact}
                            label="Contact"
                            name="contact"
                        />
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="age"
                                shrink={true}
                                type="number"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={patient.age}
                                label="Age"
                                name="age"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl  variant="outlined" fullWidth required>
                                <InputLabel id="genderId">Gender</InputLabel>
                                <Select
                                    labelId="gender"
                                    name="gender"
                                    id="gender"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={patient.gender}
                                    label="Gender" required fullWidth>
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    {
                                        ["Male", "Female", "Other"].map((gender) => {
                                            return <MenuItem
                                                value={gender}
                                                key={gender}>
                                                {gender}
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid lg={12} item>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="diagnoseWith"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={patient.diagnoseWith}
                            label="Diagnose with"
                            name="diagnoseWith"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl  variant="outlined" fullWidth required>
                            <InputLabel id="demo-customized-select-label">Country</InputLabel>
                            <Select
                                labelId="country"
                                name="country"
                                id="country"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={patient.country}
                                label="Country">
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                {
                                    countries.map((country) => {
                                        return <MenuItem
                                            value={country.id}
                                            key={country.id}>
                                            {country.label}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl  variant="outlined" fullWidth required>
                            <InputLabel id="demo-customized-select-label">State</InputLabel>
                            <Select
                                labelId="state"
                                name="state"
                                id="state"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={patient.state}
                                label="State" required fullWidth>
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                {
                                    states.map((state) => {
                                        return <MenuItem
                                            value={state.id}
                                            key={state.id}>
                                            {state.label}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl  variant="outlined" fullWidth required>
                            <InputLabel id="demo-customized-select-label">City</InputLabel>
                            <Select
                                labelId="city"
                                name="city"
                                id="city"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={patient.city}
                                label="City">
                                <MenuItem value="">
                                    <em>Select</em>
                                </MenuItem>
                                {
                                    cities.map((city) => {
                                        return <MenuItem
                                            value={city.id}
                                            key={city.id}>
                                            {city.label}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <ButtonWithLoader
                        loading={loading}
                        type="button"
                        fullWidth
                        style={{height: 40, marginTop:20}}
                        variant="contained"
                        onClick={onSubmit}
                        color="primary">
                        { patientId ?  "Update" : "Create"}
                    </ButtonWithLoader>
                </form>
            </div>
        </Grid>
    </Grid>
};

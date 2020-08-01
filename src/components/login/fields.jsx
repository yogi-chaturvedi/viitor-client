import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";

export const FormTextField = (props) => {
    const {field, fieldChanged, handleBlur, values, errors} = props;
    return <Grid item xs={12} key={field.id}>
        <TextField
            variant="outlined"
            required
            fullWidth
            id={field.id}
            onChange={fieldChanged}
            onBlur={handleBlur}
            value={values[field.id]}
            label={field.label}
            name={field.id}
        />
        {errors[field.id] &&
        <span className="field-error">{errors[field.id]}</span>}
    </Grid>
};

export const FormDropDown = (props) => {
    const {field, fieldChanged, handleBlur, values, errors, dropDowns} = props;
    return <Grid item xs={12} key={field.id}>
        <FormControl variant="outlined" fullWidth required>
            <InputLabel id={field.id}>{field.label}</InputLabel>
            <Select
                labelId={field.id}
                onChange={fieldChanged}
                label={field.label}
                fullWidth
                onBlur={handleBlur}
                value={values[field.id]}
                name={field.id}
                id={field.id}>
                <MenuItem value="">
                    <em>Select</em>
                </MenuItem>
                {

                    (dropDowns[field.id] || []).map((country) => {
                        return <MenuItem
                            value={country}
                            key={country}>
                            {country}
                        </MenuItem>
                    })
                }
            </Select>
        </FormControl>
        {errors[field.id] &&
        <span className="field-error">{errors[field.id]}</span>}
    </Grid>
};

export const FormPassword = (props) => {
    const {field, fieldChanged, handleBlur, values, errors} = props;
    return <Grid item xs={12} key={field.id}>
        <TextField
            variant="outlined"
            required
            fullWidth
            id={field.id}
            onChange={fieldChanged}
            onBlur={handleBlur}
            value={values[field.id]}
            label={field.label}
            name={field.id}
            type="password"
        />
        {errors[field.id] &&
        <span className="field-error">{errors[field.id]}</span>}
    </Grid>
}

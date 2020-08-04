import _ from "lodash";

export const validate = (patient) => {
    let errors = {};
    if (!patient.firstName) {
        errors.firstName = "Required first name";
    }

    // Validating required fields
    const requiredFields = ["firstName", "lastName", "email", "contact", "age", "diagnoseWith", "country", "state", "city"];
    _.forEach(requiredFields, field => {
        validateRequiredField(field, patient, errors);
    });

    // Validate email pattern
    if (isEmailInValid(patient.email)) {
        errors.email = "Invalid email address";
    }
    //Validate contact length i.e. 10
    if (isContactInValid(patient.contact)) {
        errors.contact = "Contact should be 10 digits";
    }
    return errors;
};

export const validateField = (patient, field) => {
    if (patient[field]) {
        if (field === "email") {
            if (isEmailInValid(patient.email)) {
                return  "Invalid email address";
            }
        } else if (field === "contact") {
            if (isContactInValid(patient.contact)) {
                return "Contact should be 10 digits";
            }
        }
    } else {
        return "Required field";
    }
};

const isEmailInValid = (email) => {
    return email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

const isContactInValid = (contact) => {
    return contact && contact.length !== 10;
};

const validateRequiredField = (field, patient, errors) => {
    if (!patient[field]) {
        errors[field] = "Required field";
    }
};

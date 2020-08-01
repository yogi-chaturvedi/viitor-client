import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

const WithLoader = (WrappedComponent) => {
    return (props) => {
        if (props.loading) {
            return <div style={styles.container}>
                <CircularProgress color="secondary"/>
            </div>
        } else {
            return <WrappedComponent {...props}>{props.children}</WrappedComponent>;
        }
    }
};

WithLoader.propTypes = {loading: PropTypes.boolean};

export default WithLoader;

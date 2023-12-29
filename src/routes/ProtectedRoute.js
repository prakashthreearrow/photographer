import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { getLocalStorageItem } from "../utils/helper";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    getLocalStorageItem("token") ? (
                        <Component {...props} />
                    ) : (
                        <Redirect to="/" />
                    )
                }
            />
        </>
    );
};

ProtectedRoute.propTypes = {
    component: PropTypes.object,
    rest: PropTypes.object,
};

export default ProtectedRoute;
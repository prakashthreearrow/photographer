import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { getLocalStorageItem } from "../utils/helper";

const PrivateRoute = ({ component: Component, ...rest }) => {
    let userData = JSON.parse(getLocalStorageItem("userData"));
  
    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    getLocalStorageItem("token") && getLocalStorageItem("userData") ? (
                        userData?.is_profile_completed === 0 ? (
                            <Component {...props} />
                        ) : (
                            <Redirect to="/dashboard" />
                        )
                    ) : (
                        <Redirect to="/" />
                    )
                }
            />
        </>
    );
};

PrivateRoute.propTypes = {
    component: PropTypes.object,
    rest: PropTypes.object,
};

export default PrivateRoute;
import React, { lazy, memo, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Loader } from "../component/CommonComponent";
import ErrorBoundary from "../component/ErrorBoundary";
import RoutesFile from "./RoutesFile";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
const NotFound = lazy(() => import("../container/404NotFound.js"));

const Routes = memo(() => {
    return (
        <Router>
            <ErrorBoundary>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        {RoutesFile.map((itm, key) =>
                            itm.type === "general" ? (
                                <ProtectedRoute
                                    key={key}
                                    exact={itm.exact}
                                    path={itm.path}
                                    name={itm.name}
                                    component={itm.component}
                                />
                            ) : itm.private ? (
                                <PrivateRoute
                                    key={key}
                                    exact={itm.exact}
                                    path={itm.path}
                                    name={itm.name}
                                    component={itm.component}
                                />
                            ) : (
                                <Route
                                    key={key}
                                    exact={itm.exact}
                                    path={itm.path}
                                    name={itm.name}
                                    component={itm.component}
                                />
                            )
                        )}
                        <Route component={NotFound} />
                    </Switch>
                </Suspense>
            </ErrorBoundary>
        </Router>
    );
});

export default Routes;
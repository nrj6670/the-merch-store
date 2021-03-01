import React from "react";
import { Route, Redirect } from "react-router-dom";

//authentication function
import { isAuthenticated } from "../../auth/helper/index";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default PrivateRoute;

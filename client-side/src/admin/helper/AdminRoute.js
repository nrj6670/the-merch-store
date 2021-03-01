import React from "react";
import { Route, Redirect } from "react-router-dom";

//authentication function
import { isAuthenticated } from "../../auth/helper/index";

const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default AdminRoute;

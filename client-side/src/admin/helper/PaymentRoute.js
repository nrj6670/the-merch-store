import React from "react";
import { Route, Redirect } from "react-router-dom";

//authentication function
import { isAuthenticated } from "../../auth/helper/index";

const PaymentRoute = ({
  component: Component,
  proceedToPay,
  setProceedToPay,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component
            proceedToPay={proceedToPay}
            setProceedToPay={setProceedToPay}
            {...props}
          />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default PaymentRoute;

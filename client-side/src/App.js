import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { React, useState } from "react";

//components
import Navbar from "./core/Navbar";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import AdminDashboard from "./user/AdminDashboard";
import ManageCategories from "./admin/ManageCategories";
import ManageProducts from "./admin/ManageProducts";
import UpdateProduct from "./admin/UpdateProduct";
import CreateProduct from "./admin/CreateProduct";
import ManageOrders from "./admin/ManageOrders";
import UpdateOrder from "./admin/UpdateOrder";
import Cart from "./core/Cart";
import CustomCheckout from "./core/CustomCheckout";
import UserDashboard from "./user/UserDashboard";
import ViewOrders from "./user/ViewOrders";
import OrderDetails from "./user/OrderDetails";
import Footer from "./core/Footer";

//protected routes
import PrivateRoute from "./admin/helper/PrivateRoute";
import AdminRoute from "./admin/helper/AdminRoute";
import PaymentRoute from "./admin/helper/PaymentRoute";

function App() {
  const [proceedToPay, setProceedToPay] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/cart" exact>
            <Cart
              proceedToPay={proceedToPay}
              setProceedToPay={setProceedToPay}
            />
          </Route>
          <AdminRoute
            path="#/admin/dashboard"
            exact
            component={AdminDashboard}
          />
          <AdminRoute
            path="/admin/categories"
            exact
            component={ManageCategories}
          />
          <AdminRoute path="/admin/products" exact component={ManageProducts} />
          <AdminRoute
            path="/admin/product/:categoryId"
            exact
            component={UpdateProduct}
          />
          <AdminRoute
            path="/admin/create/product"
            exact
            component={CreateProduct}
          />

          <AdminRoute path="/admin/orders" exact component={ManageOrders} />
          <AdminRoute path="/order/:orderId" exact component={UpdateOrder} />
          <PaymentRoute
            path="/checkout-page"
            exact
            component={CustomCheckout}
            proceedToPay={proceedToPay}
            setProceedToPay={setProceedToPay}
          />
          <PrivateRoute
            path="/user/dashboard"
            exact
            component={UserDashboard}
          />
          <PrivateRoute path="/user/orders" exact component={ViewOrders} />
          <PrivateRoute
            path="/user/order/:orderId"
            exact
            component={OrderDetails}
          />
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

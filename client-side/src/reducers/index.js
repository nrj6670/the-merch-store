import { combineReducers } from "redux";

//reducers
import productsReducer from "./productsReducer";
import categoriesReducer from "./categoriesReducer";
import ordersReducer from "./ordersReducer";

const rootReducer = combineReducers({
  products: productsReducer,
  categories: categoriesReducer,
  orders: ordersReducer,
});

export default rootReducer;

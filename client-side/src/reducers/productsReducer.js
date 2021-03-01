import { Switch } from "react-router-dom";

let Init = { products: [{}], product: {}, isLoading: false };

const productsReducer = (state = Init, action) => {
  switch (action.type) {
    case "LOADING_PRODUCTS":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_PRODUCTS":
      return {
        ...state,
        products: action.payload.products,
        isLoading: false,
      };
    case "FETCH_PRODUCT":
      return {
        ...state,
        product: action.payload.product,
        isLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default productsReducer;

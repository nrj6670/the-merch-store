import { getProducts, getProduct } from "../core/helper/coreApiCalls";
import axios from "axios";

//api url
import { API } from "../backend";

export const fetchProducts = () => async (dispatch) => {
  dispatch({
    type: "LOADING_PRODUCTS",
  });

  const productsData = await getProducts();

  dispatch({
    type: "FETCH_PRODUCTS",
    payload: {
      products: productsData,
    },
  });
};

export const fetchProduct = (productId) => async (dispatch) => {
  dispatch({
    type: "LOADING_PRODUCTS",
  });

  const productData = await getProduct(productId);

  dispatch({
    type: "FETCH_PRODUCT",
    payload: {
      product: productData,
    },
  });
};

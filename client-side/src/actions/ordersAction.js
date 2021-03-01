import { API } from "../backend";

//api calls
import { getOrders, getOrder } from "../admin/helper/adminApiCalls";
import { getAllUserOrders } from "../user/helper/userApiCalls";

export const fetchOrders = (userId, token) => async (dispatch) => {
  dispatch({
    type: "LOADING_ORDERS",
  });

  const ordersData = await getOrders(userId, token);

  dispatch({
    type: "FETCH_ORDERS",
    payload: {
      orders: ordersData,
    },
  });
};

export const fetchOrder = (orderId, userId, token) => async (dispatch) => {
  dispatch({
    type: "LOADING_ORDERS",
  });

  const orderData = await getOrder(orderId, userId, token);

  dispatch({
    type: "FETCH_ORDER",
    payload: {
      order: orderData,
    },
  });
};

export const fetchUserOrders = (userId, token) => async (dispatch) => {
  dispatch({
    type: "LOADING_ORDERS",
  });

  const orderData = await getAllUserOrders(userId, token);

  dispatch({
    type: "FETCH_ORDERS",
    payload: {
      orders: orderData,
    },
  });
};

let Init = { orders: [], order: {}, isLoading: false };

const ordersReducer = (state = Init, action) => {
  switch (action.type) {
    case "LOADING_ORDERS":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_ORDERS":
      return {
        ...state,
        orders: action.payload.orders,
        isLoading: false,
      };
    case "FETCH_ORDER":
      return {
        ...state,
        order: action.payload.order,
        isLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default ordersReducer;

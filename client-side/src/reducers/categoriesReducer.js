let Init = { categories: [], category: {}, isLoading: false };

const categoriesReducer = (state = Init, action) => {
  switch (action.type) {
    case "LOADING_CATEGORIES":
      return {
        ...state,
        isLoading: true,
      };
    case "FETCH_CATEGORIES":
      return {
        ...state,
        isLoading: false,
        categories: action.payload.categories,
      };
    case "FETCH_CATEGORY":
      return {
        ...state,
        isLoading: false,
        category: action.payload.category,
      };
    default:
      return {
        ...state,
      };
  }
};

export default categoriesReducer;

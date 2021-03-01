import { API } from "../backend";

//api calls
import { getAllCategories, getCategory } from "../admin/helper/adminApiCalls";

export const fetchCategories = () => async (dispatch) => {
  dispatch({
    type: "LOADING_CATEGORIES",
  });

  const categories = await getAllCategories();

  dispatch({
    type: "FETCH_CATEGORIES",
    payload: {
      categories: categories,
    },
  });
};

export const fetchCategory = () => async (dispatch) => {
  dispatch({
    type: "LOADING_CATEGORIES",
  });

  const category = await getCategory();

  dispatch({
    type: "FETCH_CATEGORY",
    payload: {
      category: category,
    },
  });
};

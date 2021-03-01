import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

//action
import { fetchCategories } from "../actions/categoriesAction";

//components
import Popup from "../core/Popup";

//authentication
import { isAuthenticated } from "../auth/helper/index";

//api calls
import {
  updateCategory,
  deleteCategory,
  createCategory,
} from "./helper/adminApiCalls";

const ManageCategories = () => {
  //initializing dispatcher
  const dispatch = useDispatch();

  //user data
  const { user, token } = isAuthenticated();

  //states
  const [value, setValue] = useState({
    id: "",
    name: "",
  });
  const [result, setResult] = useState({
    isProcessing: false,
    error: false,
    success: false,
  });

  const { isProcessing } = result;

  const [reload, setReload] = useState(false);
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  //use effect
  useEffect(() => {
    dispatch(fetchCategories());
  }, [reload]);

  //categories data
  const { categories, isLoading } = useSelector((store) => store.categories);
  const categoriesFound = !isLoading ? categories.length : 0;

  //event handlers
  const changeInCategory = (event) => {
    setValue({ ...value, name: event.target.value });
  };

  const newValueHandler = (event) => {
    setNewCategory(event.target.value);
  };

  const updateButtonHandler = (category) => {
    setValue({ ...value, id: category._id, name: category.name });
    setOpenUpdatePopup(true);
  };

  const updateCategoryHandler = () => {
    setResult({ ...result, isProcessing: true });
    updateCategory(value.id, user._id, token, { name: value.name })
      .then((response) => {
        setOpenUpdatePopup(false);
        setValue({ ...value, id: "", name: "" });
        setResult({ isProcessing: false, error: false, success: true });
        setReload(!reload);
      })
      .catch((error) => {
        setResult({ isProcessing: false, error: true, success: false });
      });
  };

  const deleteButtonHandler = (category) => {
    deleteCategory(category._id, user._id, token)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        alert("Unable to delete category");
      });
  };

  const createCategoryHandler = () => {
    setResult({ isProcessing: true });
    createCategory(user._id, token, {
      name: newCategory,
    })
      .then((response) => {
        setOpenCreatePopup(false);
        setNewCategory("");
        setResult({ isProcessing: false, error: false, success: true });
        setReload(!reload);
      })
      .catch((error) => {
        setResult({ isProcessing: false, error: true, success: false });
      });
  };

  //templates
  const updateHandlerPopup = () => {
    return (
      <Popup title="Update category">
        <CategoryInput
          type="text"
          value={value.name}
          onChange={changeInCategory}
        />
        <PopupContainer>
          <button
            disabled={isProcessing}
            style={{ cursor: isProcessing ? "wait" : "pointer" }}
            onClick={updateCategoryHandler}
          >
            Update
          </button>
          <button
            disabled={isProcessing}
            style={{ cursor: isProcessing ? "wait" : "pointer" }}
            onClick={() => {
              setOpenUpdatePopup(false);
            }}
          >
            Cancel
          </button>
        </PopupContainer>
      </Popup>
    );
  };

  const createHandlerPopup = () => {
    return (
      <Popup title="Create category">
        <CategoryInput
          type="text"
          value={newCategory}
          onChange={newValueHandler}
        />
        <PopupContainer>
          <button
            disabled={isProcessing}
            style={{ cursor: isProcessing ? "wait" : "pointer" }}
            onClick={createCategoryHandler}
          >
            Create
          </button>
          <button
            disabled={isProcessing}
            style={{ cursor: isProcessing ? "wait" : "pointer" }}
            onClick={() => {
              setOpenCreatePopup(false);
              setNewCategory("");
            }}
          >
            Cancel
          </button>
        </PopupContainer>
      </Popup>
    );
  };

  return (
    <CategoryContainer>
      <h3>Total {categoriesFound} found : </h3>
      {openUpdatePopup && updateHandlerPopup()}
      {openCreatePopup && (
        <>
          {console.log("create popup")}
          {createHandlerPopup()}
        </>
      )}
      {!isLoading && categories.length !== 0 ? (
        categories.map((category) => {
          return (
            <>
              <Category key={category._id}>
                <ul>
                  <li>{category.name}</li>
                  <li>
                    <span onClick={() => updateButtonHandler(category)}>
                      Update
                    </span>
                  </li>
                  <li>
                    <span onClick={() => deleteButtonHandler(category)}>
                      Delete
                    </span>
                  </li>
                </ul>
              </Category>
            </>
          );
        })
      ) : (
        <h2>No category to show</h2>
      )}
      <CreateCategory
        onClick={() => {
          setOpenCreatePopup(true);
          console.log(openCreatePopup);
        }}
      >
        Create new category
      </CreateCategory>
    </CategoryContainer>
  );
};

const CategoryContainer = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 406px) {
    padding: 1rem 1rem;
  }
`;

const Category = styled.div`
  margin: 1rem 0rem;
  border: 1px solid black;
  font-size: 1.2rem;
  ul {
    display: flex;
    justify-content: space-evenly;
    padding: 0.5rem;
    transition: all 0.3s ease;

    li {
      padding: 0.3rem;
    }

    li:nth-child(2) {
      background: #38cc77;
      color: white;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background: #1faa59;
      }
    }

    li:nth-child(3) {
      background: #e21717;
      padding: 0.4rem;
      color: white;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background: #b4161b;
      }
    }
  }

  ul:hover {
    background: rgba(3, 32, 60, 0.3);
  }
`;

const CategoryInput = styled.input`
  outline: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  display: block;
  &:focus {
    border: 2px solid #28cbe7;
  }
`;

const PopupContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 1rem;

  button:nth-child(1) {
    color: white;
    background: #38cc77;
    border: none;
    padding: 0.3rem 0.5rem;
    border-radius: 5px;
  }

  button:nth-child(2) {
    color: white;
    background: #e21717;
    border: none;
    padding: 0.3rem 0.5rem;
    border-radius: 5px;
  }
`;

const CreateCategory = styled.button`
  border: none;
  background: #1b98f5;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  font-size: 1rem;
`;

export default ManageCategories;

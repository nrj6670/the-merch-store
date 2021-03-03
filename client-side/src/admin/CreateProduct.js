import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//actions
import { fetchCategories } from "../actions/categoriesAction";

//authentication
import { isAuthenticated } from "../auth/helper/index";

//api calls
import { createProduct } from "./helper/adminApiCalls";

const CreateProduct = ({ match }) => {
  //initializing dispatcher
  const dispatch = useDispatch();
  const history = useHistory();

  //user data
  const { user, token } = isAuthenticated();

  //effect
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  //state
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    photo: "",
    sizes: [],
    formData: new FormData(),
  });

  const { categories, isLoading: isLoadingCategories } = useSelector(
    (state) => state.categories
  );

  const [status, setStatus] = useState({
    error: false,
    success: false,
    isFieldEmpty: false,
    isProcessing: false,
  });

  const [redirectCount, setRedirectCount] = useState(3);
  //state to preview image to be uploaded
  const [image, setImage] = useState("");

  //destructuring states
  const {
    name,
    description,
    price,
    stock,
    category,
    formData,
    sizes,
  } = productInfo;
  const { error, success, isFieldEmpty, isProcessing } = status;

  //event handlers
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setProductInfo({ ...productInfo, [name]: value });

    if (name === "photo") {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleCheckbox = (event) => {
    const ifSizeExists = sizes.indexOf(event.target.value);
    if (ifSizeExists > -1) {
      sizes.splice(ifSizeExists, 1);
    } else {
      sizes.push(event.target.value);
    }
    formData.set("sizes", sizes);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    window.scrollTo(500, 0);
    setStatus({
      ...status,
      isProcessing: true,
      error: false,
      success: false,
      isFieldEmpty: false,
    });
    if (
      !name ||
      category === "" ||
      category === "select" ||
      !price ||
      !description ||
      !stock ||
      sizes.length === 0
    ) {
      return setStatus({
        ...status,
        error: true,
        success: false,
        isFieldEmpty: true,
        isProcessing: false,
      });
    }

    createProduct(user._id, token, formData)
      .then((response) => {
        console.log(response);
        setProductInfo({
          ...productInfo,
          name: "",
          description: "",
          price: "",
          stock: "",
          category: "",
        });
        setStatus({
          ...status,
          error: false,
          success: true,
          isFieldEmpty: false,
          isProcessing: false,
        });
      })
      .catch((error) => {
        setStatus({
          ...status,
          error: true,
          success: false,
          isFieldEmpty: false,
          isProcessing: false,
        });
      });
  };

  const performRedirect = (path) => {
    const { push } = history;
    setTimeout(() => {
      push(path);
    }, 3000);
    setInterval(() => {
      setRedirectCount(redirectCount - 1);
      if (redirectCount === 0) {
        clearInterval();
      }
    }, 1000);
  };

  const resetError = () => {
    setTimeout(() => {
      setStatus({
        error: false,
        success: false,
        isFieldEmpty: false,
        isProcessing: false,
      });
    }, 3000);
  };

  //sizes array
  const sizesName = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <ProductContainer>
      {success && (
        <Message>
          <h2>Product created successfully</h2>
          <h3>Redirecting in {redirectCount}</h3>
          {performRedirect("/admin/products")}
          {window.scrollTo(500, 0)}
        </Message>
      )}
      {error && (
        <Message>
          <h2>Error updating product</h2>
          {isFieldEmpty && sizes.length !== 0 && (
            <h3>Please fill all the fields</h3>
          )}
          {isFieldEmpty && sizes.length === 0 && (
            <h3>Please select size atleast one size</h3>
          )}
          {!isFieldEmpty && <h3>Error occured while updating the product</h3>}
          {resetError()}
          {window.scrollTo(500, 0)}
        </Message>
      )}
      {isProcessing && (
        <Message>
          <h2>Processing your request please wait</h2>
          {window.scrollTo(500, 0)}
        </Message>
      )}
      <FormField onSubmit={submitHandler}>
        <div>
          {image && <img src={image} alt="product-preview" />}
          <h3>Select image to upload : </h3>
          <input
            type="file"
            name="photo"
            id="photo"
            accept="image"
            onChange={handleChange("photo")}
            placeholder="choose a file"
          />
        </div>
        <div>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            maxLength="23"
            onChange={handleChange("name")}
            placeholder="Product name (max length : 23 characters)"
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={handleChange("description")}
            placeholder="Product description"
          />
        </div>
        <div>
          <input
            type="text"
            name="price"
            id="price"
            value={price}
            onChange={handleChange("price")}
            placeholder="Product price"
          />
        </div>
        <div>
          <select
            placeholder="category"
            onChange={handleChange("category")}
            name="category"
            id="category"
          >
            <option value="select">Select</option>
            {!isLoadingCategories &&
              categories.map((category) => {
                return (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
        </div>
        <h3>Select sizes:</h3>
        <SizeContainer>
          {sizesName.map((size) => {
            return (
              <SizeSelector key={size}>
                <input
                  type="checkbox"
                  onClick={handleCheckbox}
                  name={size}
                  id={size}
                  value={size}
                />
                <span>{size}</span>
              </SizeSelector>
            );
          })}
        </SizeContainer>
        <div>
          <input
            type="text"
            name="quantity"
            id="quantity"
            value={stock}
            onChange={handleChange("stock")}
            placeholder="Product quantity"
          />
        </div>
        <div>
          <button disabled={isProcessing}>Submit</button>
        </div>
      </FormField>
    </ProductContainer>
  );
};

const ProductContainer = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);

  img {
    width: 50%;
    height: 50%;
  }
  @media screen and (max-width: 406px) {
    padding: 1rem 1rem;
  }

  @media screen and (max-width: 800px) {
    img {
      width: 70%;
      height: 60%;
    }
  }
`;

const FormField = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  div {
    padding: 1rem 0rem;
    input[type="file"] {
      width: 50%;
    }

    input[type="text"],
    select {
      padding: 0.4rem;
      font-size: 1rem;
      width: 50%;
    }
  }

  button {
    padding: 1rem 2rem;
    border: none;
    background: #383cc1;
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
  }

  @media screen and (max-width: 800px) {
    div {
      input[type="file"] {
        width: 70%;
      }

      input[type="text"],
      select {
        padding: 0.4rem;
        font-size: 1rem;
        width: 70%;
      }
    }
  }
`;

const Message = styled.div`
  display: block;
  background: #edbf69;
  padding: 0.2rem 0rem;
  text-align: center;

  width: 50%;
  margin: auto;
  margin-bottom: 0.5rem;

  @media screen and (max-width: 800px) {
    width: 70%;
  }
`;

const SizeContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const SizeSelector = styled.p`
  position: relative;
  font-size: 1rem;
  width: 2.1rem;
  height: 1.5rem;
  margin: 0rem 0.5rem;

  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 1px solid black;
    z-index: 1;
  }
  input:checked + span {
    border: 2px solid #14e4f3;
  }
`;

export default CreateProduct;

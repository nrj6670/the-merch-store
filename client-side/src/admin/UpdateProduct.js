import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { API } from "../backend";

//actions
import { fetchProduct } from "../actions/productsAction";
import { fetchCategories } from "../actions/categoriesAction";

//authentication
import { isAuthenticated } from "../auth/helper/index";

//api calls
import { updateProduct } from "./helper/adminApiCalls";

const UpdateProduct = () => {
  //initializing dispatcher, location and history
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  //user data
  const { user, token } = isAuthenticated();

  //extracting product and categories data
  const { product, isLoading } = useSelector((state) => state.products);
  const { categories, isLoading: isLoadingCategories } = useSelector(
    (state) => state.categories
  );

  //effect
  useEffect(() => {
    dispatch(fetchProduct(location.pathname.split("/")[3]));
    dispatch(fetchCategories());
    setPreviewImage("");
  }, []);

  useEffect(() => {
    setProductInfo({
      ...productInfo,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      availableCategory: product.category,
      availableSize: product.sizes,
      formData: new FormData(),
    });
  }, [!isLoading]);

  //state
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    availableCategory: {
      _id: "",
      name: "",
    },
    photo: "",
    availableSize: [],
    sizes: [],
    category: "",
    formData: "",
  });

  const [status, setStatus] = useState({
    error: false,
    success: false,
    isFieldEmpty: false,
  });
  const [redirectCount, setRedirectCount] = useState(3);

  const { error, success, isFieldEmpty } = status;

  const {
    name,
    description,
    price,
    stock,
    availableCategory,
    availableSize,
    sizes,
    formData,
  } = productInfo;

  //state to preview image to be uploaded
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setProductInfo({ ...productInfo, [name]: value });
    console.log(name + " " + value);
    if (name === "photo") {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
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
    updateProduct(location.pathname.split("/")[3], user._id, token, formData)
      .then((response) => {
        setStatus({
          ...status,
          error: false,
          success: true,
          isFieldEmpty: false,
        });
      })
      .catch((error) => {
        setStatus({
          ...status,
          error: true,
          success: false,
          isFieldEmpty: false,
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

  let imageURL =
    previewImage && !isLoading
      ? previewImage
      : `${API}/product/photo/${product._id}`;

  //sizes array
  const sizesName = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <ProductContainer>
      {success && (
        <Message>
          <h2>Update successful</h2>
          {window.scrollTo(500, 0)}
          <h3>Redirecting in {redirectCount}</h3>
          {performRedirect("/admin/products")}
        </Message>
      )}
      {error && (
        <Message>
          <h2>Error updating product</h2>
          {isFieldEmpty && <h3>Please fill all the fields</h3>}
          {!isFieldEmpty && <h3>Error occured while updating the product</h3>}
          {window.scrollTo(500, 0)}
        </Message>
      )}
      <img src={imageURL} alt="product" />
      <FormField onSubmit={submitHandler}>
        {Object.keys(product).length !== 0 && (
          <>
            <div>
              <h3>Select image to upload : </h3>
              <input
                type="file"
                name="photo"
                id="photo"
                inputProps
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
                required
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
                required
              />
            </div>

            <h3>Currently available sizes are : {availableSize}</h3>
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
                name="price"
                id="price"
                value={price}
                onChange={handleChange("price")}
                placeholder="Product price"
                required
              />
            </div>
            <div>
              {availableCategory !== undefined && !isLoadingCategories && (
                <select
                  placeholder="category"
                  onChange={handleChange("category")}
                  name="category"
                  id="category"
                >
                  <option value={availableCategory._id}>
                    {availableCategory.name}
                  </option>
                  {categories.map((item) => {
                    if (item._id !== availableCategory._id) {
                      return (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      );
                    }
                  })}
                </select>
              )}
            </div>
            <div>
              <input
                type="text"
                name="quantity"
                id="quantity"
                value={stock}
                onChange={handleChange("stock")}
                placeholder="Product quantity"
                required
              />
            </div>
            <div>
              <button>Submit</button>
            </div>
          </>
        )}
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

export default UpdateProduct;

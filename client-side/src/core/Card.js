import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

//api url
import { API } from "../backend";

//action
import { fetchProduct } from "../actions/productsAction";

//cart helper funtion
import { addToCart } from "./helper/cartHelper";

const Card = ({
  product,
  openPopup,
  setOpenPopup,
  showRemoveFromCart = false,
}) => {
  //initialisation dispatch
  const dispatch = useDispatch();

  //sizes array
  let availableSizes =
    product && product.sizes ? product.sizes[0].split(",") : [];
  const sizesName = ["XS", "S", "M", "L", "XL", "XXL"];

  //states
  const [value, setValue] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sold: "",
    size: "",
  });
  const [message, setMessage] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const { product: productData } = useSelector((state) => state.products);

  //event handlers
  const productSelected = (event) => {
    setValue({
      ...value,
      _id: productData._id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      stock: productData.stock,
      sold: productData.sold,
      size: event.target.value,
    });
    setMessage(false);
  };

  const cardClicked = () => {
    dispatch(fetchProduct(product._id));
    setOpenPopup(true);
  };

  const exitHandler = (event) => {
    if (event.target.classList.contains("card-shadow")) {
      document.body.style.overflow = "auto";
      setOpenPopup(false);
    }
  };

  const addToCartHandler = () => {
    if (value._id === "") {
      return setMessage(true);
    }
    addToCart(value);
    return setRedirect(true);
  };

  const getRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  //templates
  const getPopup = () => {
    return (
      openPopup && (
        <ProductDialog className="card-shadow" onClick={exitHandler}>
          <DetailCard>
            <div>
              <h2>{productData.name}</h2>
              <img
                src={`${API}/product/photo/${productData._id}`}
                alt={product.name}
              />
              <h3>Description : </h3>
              <p>{productData.description}</p>
              {message && (
                <Message>
                  <h3>Please select a size</h3>
                </Message>
              )}
              <h3>Select size:</h3>
              <SizeContainer>
                {sizesName.map((size) => {
                  if (availableSizes.includes(size)) {
                    return (
                      <SizeSelector key={size}>
                        <input
                          type="radio"
                          name="size"
                          id={size}
                          value={size}
                          onClick={productSelected}
                        />
                        <span>{size}</span>
                      </SizeSelector>
                    );
                  }
                })}
              </SizeContainer>
            </div>
            <button onClick={addToCartHandler}>Add to cart</button>
          </DetailCard>
        </ProductDialog>
      )
    );
  };

  const getCards = () => {
    return (
      <StyledCard onClick={cardClicked}>
        <div>
          <img src={`${API}/product/photo/${product._id}`} alt={product.name} />
          <div>
            <h2>{product.name}</h2>
            <p>&#8377; {product.price}</p>
            <h3>Available sizes : </h3>
            <SizeContainer>
              {sizesName.map((size) => {
                if (availableSizes.includes(size)) {
                  return (
                    <SizeSelector key={size}>
                      <span>{size}</span>
                    </SizeSelector>
                  );
                }
              })}
            </SizeContainer>
            {showRemoveFromCart && <button>Remove from cart</button>}
          </div>
        </div>
      </StyledCard>
    );
  };

  return (
    <>
      {getRedirect(redirect)}
      {openPopup && (document.body.style.overflow = "hidden")}
      {getPopup()}
      {getCards()}
    </>
  );
};

const StyledCard = styled.div`
  min-height: 20vh;
  padding: 0.5rem;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;

  img {
    margin-top: 1rem;
    width: 95%;
    object-fit: cover;
  }

  h2 {
    margin: 0.5rem 0rem;
    font-size: 1.5rem;
  }

  p {
    font-size: 1.2rem;
  }

  button {
    padding: 0.8rem 1rem;
    margin-top: 0.9rem;
    border: none;
    border-radius: 8px;
    background: green;
    color: white;
  }

  @media screen and (max-width: 406px) {
    min-height: 30vh;
    padding: 0.2rem;
    button {
      margin-bottom: 1rem;
    }
  }

  &:hover {
    background: rgba(117, 130, 131, 0.2);
  }
`;

const SizeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.2rem;
`;
const SizeSelector = styled.p`
  position: relative;
  font-size: 1rem;
  width: 2.3rem;
  height: 2.1rem;
  margin: 0rem 0.5rem;

  input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
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
    border: 2px solid #20c7dd;
  }
`;

const ProductDialog = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-y: scroll;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: gray;
  }
`;

const DetailCard = styled.div`
  width: 70%;
  min-height: 80vh;
  margin: 10vh auto;
  background: white;
  h2 {
    padding: 2rem 0rem;
  }
  img {
    width: 70%;
    height: 70vh;
  }

  p {
    font-size: 1.4rem;
  }

  button {
    border: none;
    color: white;
    background: #03203c;
    padding: 0.8rem;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 1111px) {
    width: 80%;
    img {
      width: 75%;
      height: 60vh;
    }
  }

  @media screen and (max-width: 500px) {
    width: 80%;
    img {
      width: 90%;
      height: 40vh;
    }
  }
`;

const Message = styled.div`
  background: #e8bd0d;
  display: block;
  width: 60%;
  margin: 1rem auto;
`;
export default Card;

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//api link
import { API } from "../backend";

//cart helper functions
import { loadCart, changeQuantity, removeItem } from "./helper/cartHelper";

//authentication
import { isAuthenticated } from "../auth/helper/index";

const Cart = ({ proceedToPay, setProceedToPay = (f) => f }) => {
  //state
  const [cartItems, setCartItems] = useState([]);
  const [reload, setReload] = useState(false);

  //use effect
  useEffect(() => {
    document.body.style.overflow = "auto";
    setCartItems(loadCart());
  }, [reload]);

  //event handler
  const getFinalAmount = () => {
    let amount = 0;
    cartItems.forEach((product) => {
      amount += product.count * product.price;
    });
    return amount;
  };

  const changeQuantityHandler = (operation, product) => {
    changeQuantity(operation, product);
    setReload(!reload);
  };

  const removeItemHandler = (product) => {
    removeItem(product);
    setReload(!reload);
  };

  //templates
  const getProductCardsForCart = () => {
    return (
      <CardContainer>
        {cartItems.length !== 0 ? (
          cartItems.map((product) => {
            return (
              <StyledCard key={product._id}>
                <div>
                  <img
                    src={`${API}/product/photo/${product._id}`}
                    alt={product._id}
                  />
                </div>
                <div>
                  <h2>{product.name}</h2>
                  <p>&#8377; {product.price}</p>
                  <div className="quantity-handler">
                    <button
                      onClick={() => changeQuantityHandler("decrease", product)}
                      className="decrementer"
                    >
                      -
                    </button>
                    <span className="quantity">{product.count}</span>
                    <button
                      onClick={() => changeQuantityHandler("increase", product)}
                      className="incrementer"
                    >
                      +
                    </button>
                  </div>
                  <p>
                    Selected size : <span>{product.size}</span>
                  </p>
                  <button onClick={() => removeItemHandler(product)}>
                    Remove
                  </button>
                </div>
              </StyledCard>
            );
          })
        ) : (
          <Link to="/">Add item</Link>
        )}
      </CardContainer>
    );
  };

  const getBillInfo = () => {
    return (
      cartItems.length !== 0 && (
        <BillInfo>
          <div>
            {cartItems.map((product) => {
              return (
                <p key={product._id}>
                  {product.name} = {product.count} x &#8377;{product.price}
                </p>
              );
            })}
            <Line></Line>
            <p>Total amount = &#8377;{getFinalAmount()}</p>
          </div>
          {isAuthenticated() ? (
            <PayButton onClick={() => setProceedToPay(true)}>
              <Link to="/checkout-page">Pay now</Link>
            </PayButton>
          ) : (
            <Link to="/signin">Signin</Link>
          )}
        </BillInfo>
      )
    );
  };

  return (
    <StyledCart>
      {getProductCardsForCart()}
      {getBillInfo()}
    </StyledCart>
  );
};

const StyledCart = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;

  .quantity-handler {
    @media screen and (max-width: 461px) {
      width: 100%;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2 1 40rem;

  a {
    font-size: 1.5rem;
    background: #e07c24;
    padding: 0.5rem;
    color: white;
    width: 40%;
    margin: auto;
  }
`;

const StyledCard = styled.div`
  min-height: 20vh;
  width: 70%;
  margin: 1rem auto;
  padding: 0.5rem;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
  display: flex;

  div {
    width: 50%;
  }
  div:nth-child(2) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .decrementer {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
      border-radius: 50%;
      background: #e21717;
      color: white;
      outline: none;
    }
    .incrementer {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
      border-radius: 50%;
      background: #3dbe29;
      color: white;
      outline: none;
    }
    .quantity {
      font-size: 1rem;
      margin: 0rem 0.5rem;
    }
  }
  img {
    margin-top: 1.2rem;
    width: 90%;
    height: 80%;
  }

  h2 {
    margin: 0.5rem 0rem;
    font-size: 1.5rem;
  }

  p {
    font-size: 1.2rem;
  }

  button {
    padding: 0.4rem;
    margin-top: 0.9rem;
    border: none;
    border-radius: 8px;
    background: green;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  @media screen and (max-width: 406px) {
    min-height: 30vh;
    width: 95%;
    padding: 0.2rem;
    div:nth-child(1) {
      width: 60%;
    }
    div::nth-child(2) {
      width: 40%;
    }
    button {
      margin-bottom: 1rem;
    }
    img {
      margin-top: 3rem;
      width: 95%;
      height: 70%;
    }
  }

  &:hover {
    background: rgba(117, 130, 131, 0.2);
  }
`;

const BillInfo = styled.div`
  margin: 2rem 0rem;
  flex: 1 1 30rem;
  font-size: 1.5rem;
  div {
    border: 2px solid black;
  }

  a {
    display: inline-block;
    margin-top: 2rem;
    border: none;
    border-radius: 10px;
    background: #0d0d0d;
    color: white;
    padding: 0.8rem 1.2rem;
    font-size: 1.2rem;
  }

  .billing-form {
    margin: 2rem 0rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-y: scroll;
    height: 40vh;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: gray;
    }

    input {
      width: 90%;
      margin: 1rem 1.5rem;
      border-radius: 5px;
      font-size: 1.2rem;
      padding: 0.5rem;
      outline: none;
      transition: all 0.3s ease;
      color: #161616;

      &:focus {
        border: 2px solid #2cb62c;
      }
    }

    select {
      width: 90%;
      margin: 1rem 1.5rem;
      border-radius: 5px;
      font-size: 1.2rem;
      padding: 0.5rem;
      outline: none;
    }

    h3 {
      margin-left: 5%;
    }
  }
`;

const Line = styled.p`
  width: 60%;
  margin: 1rem auto;
  height: 0.3rem;
  background: gray;
`;

const PayButton = styled.button`
  border: none;
  border-radius: 10px;
  background: #0d0d0d;
  color: white;
  font-size: 1.2rem;
  margin-top: 2rem;

  a {
    margin-top: 0.2rem;
  }
`;

export default Cart;

import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

//actions
import { fetchOrder } from "../actions/ordersAction";

//authorization
import { isAuthenticated } from "../auth/helper/index";

const OrderDetails = () => {
  //initializing dispatch and location
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  //user data
  const { user, token } = isAuthenticated();

  //state

  //useEffect
  useEffect(() => {
    console.log(path.split("/")[3]);
    dispatch(fetchOrder(path.split("/")[3], user._id, token));
  }, []);

  const { order, isLoading } = useSelector((state) => state.orders);
  !isLoading && console.log(order);

  //event handlers

  return (
    <OrderContainer>
      {Object.keys(order).length !== 0 && (
        <>
          <OrderInfo>
            <div>
              <h3>Order summary</h3>
              <ul>
                <li>
                  <b>OrderID:</b>
                </li>
                <li>{order._id}</li>
              </ul>
              <ul>
                <li>
                  <b>Purchase date:</b>
                </li>
                <li>{order.createdAt.split("T")[0]}</li>
              </ul>
              <ul>
                <li>
                  <b>Amount:</b>
                </li>
                <li>&#8377; {order.amount}</li>
              </ul>
              <ul>
                <li>
                  <b
                    style={{
                      background: "green",
                      color: "white",
                      padding: "0.2rem",
                    }}
                  >
                    Status:{" "}
                  </b>
                </li>
                <li>{order.status}</li>
              </ul>
            </div>

            <div>
              <h3>Shipping address</h3>
              <ul>
                <li>
                  <b>Name:</b>
                </li>
                <li>{order.address.buyer}</li>
              </ul>
              <ul>
                <li>
                  <b>Phone:</b>
                </li>
                <li>{order.address.phone}</li>
              </ul>
              <ul>
                <li>
                  <b>Email:</b>
                </li>
                <li>{order.address.email}</li>
              </ul>
              <ul>
                <li>
                  <b>Address:</b>
                </li>
                <li>
                  {order.address.address_line +
                    ", " +
                    order.address.city +
                    ", " +
                    order.address.pincode +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country}
                </li>
              </ul>
            </div>
          </OrderInfo>
          <OrderContent>
            <h3>Order content</h3>
            {order.products.map((product, index) => {
              return (
                <div key={product._id}>
                  <ul>
                    <li>
                      <b>{`${index + 1}. ${product.name}`}</b>
                    </li>
                    <li>{`ProductId : ${product._id} `}</li>
                    <li>{`Qty : ${product.count}`}</li>
                    <li>{`Size : ${product.size}`}</li>
                  </ul>
                </div>
              );
            })}
          </OrderContent>
          {/* <CancelButton
            onClick={() => {
              if (
                order.status === "Cancelled" ||
                order.status === "Delivered"
              ) {
                return setorderCompleted(true);
              }
              performStatusChange("Cancelled");
            }}
          >
            Cancel order
          </CancelButton> */}
        </>
      )}
    </OrderContainer>
  );
};

const OrderContainer = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);
  font-size: 1.2rem;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  div {
    margin-top: 1rem;
    border: 2px solid black;
    ul {
      display: flex;
      justify-content: flex-start;
      li {
        padding: 0.3rem;
      }
    }
  }

  @media screen and (max-width: 1384px) {
    flex-direction: column;
  }
`;

const OrderContent = styled.div`
  border: 2px solid black;
  margin: 2rem 0rem;
  padding: 1rem;

  div {
    border: 1px solid black;
    margin: 1rem 0rem;

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        flex: 1 1 10rem;
      }
    }

    @media screen and (max-width: 445px) {
      ul {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;

        li {
          flex: 0 0 0rem;
          margin: 0.5rem 0rem;
        }
      }
    }
  }
`;

export default OrderDetails;

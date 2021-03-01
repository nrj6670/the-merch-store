import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//actions
import { fetchOrders } from "../actions/ordersAction";

//authorization
import { isAuthenticated } from "../auth/helper/index";

const ManageOrders = () => {
  //initializing dispatch
  const dispatch = useDispatch();

  //user data
  const { user, token } = isAuthenticated();

  //useEffect
  useEffect(() => {
    dispatch(fetchOrders(user._id, token));
  }, []);

  const { orders, isLoading } = useSelector((state) => state.orders);

  return (
    <OrdersContainer>
      {!isLoading && orders.length !== 0 ? (
        orders.map((order) => {
          return (
            <OrderList key={order._id}>
              <li>Order number : {order._id}</li>
              <li>Placed on : {order.createdAt.split("T")[0]}</li>
              <li>Status : {order.status}</li>
              <li>
                <Link to={`/order/${order._id}`}>View order</Link>
              </li>
            </OrderList>
          );
        })
      ) : (
        <h3>No order to show</h3>
      )}
    </OrdersContainer>
  );
};

const OrdersContainer = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);
`;

const OrderList = styled.ul`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  border: 2px solid black;
  padding: 0.8rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  transition: all 0.5s ease;

  li {
    flex: 1 1 15rem;
    padding: 0.2rem;
  }

  li:nth-child(4) {
    padding: 0.3rem;
  }

  li a {
    background: #207398;
    padding: 0.5rem;
    color: white;
    border-radius: 5px;
  }

  &:hover {
    background: rgba(32, 115, 152, 0.4);
    color: white;
  }
`;

export default ManageOrders;

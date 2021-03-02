import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";

//actions
import { fetchOrder } from "../actions/ordersAction";

//authorization
import { isAuthenticated } from "../auth/helper/index";

//api calls
import { updateOrderStatus } from "./helper/adminApiCalls";

//components
import Popup from "../core/Popup";

const UpdateOrder = () => {
  //initializing dispatch and location
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;

  //user data
  const { user, token } = isAuthenticated();

  //state
  const [statusPopup, setStatusPopup] = useState(false);
  const [statusValue, setStatusValue] = useState("select");
  const [showMessage, setShowMessage] = useState({
    error: false,
    success: false,
    isProcessing: false,
  });
  const { error, success, isProcessing } = showMessage;

  const [showMessageInPopup, setShowMessageInPopup] = useState(false);
  const [countDown, setCountDown] = useState(3);
  const [orderCompleted, setorderCompleted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");

  //useEffect
  useEffect(() => {
    dispatch(fetchOrder(path.split("/")[2], user._id, token));
  }, []);

  const { order, isLoading } = useSelector((state) => state.orders);

  //event handlers
  const destroyMessage = () => {
    setTimeout(() => {
      setShowMessage({ ...showMessage, error: false, success: false });
      setorderCompleted(false);
    }, 3000);
  };
  const performStatusChange = (status) => {
    updateOrderStatus(order._id, user._id, token, {
      orderId: order._id,
      status,
    })
      .then((response) => {
        if (status === "Delivered" || status === "Cancelled") {
          setorderCompleted(true);
        }
        setStatusPopup(false);
        setCurrentStatus(status);
        order.status = status;
        setShowMessage({
          ...showMessage,
          error: false,
          success: true,
          isProcessing: false,
        });
      })
      .catch((error) => {
        setStatusPopup(false);
        setShowMessage({
          ...showMessage,
          error: true,
          success: false,
          isProcessing: false,
        });
      });
  };

  //data
  const status = ["Received", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex =
    Object.keys(order).length !== 0 ? status.indexOf(order.status) : "";

  return (
    <OrderContainer>
      {error && (
        <Message>
          <h3>Sorry cannot update the status at the moment</h3>
          {window.scrollTo(500, 0)}
          {destroyMessage()}
        </Message>
      )}
      {success && (
        <Message>
          <h3>Status updated successfully</h3>
          {window.scrollTo(500, 0)}
          {destroyMessage()}
        </Message>
      )}

      {!success && orderCompleted && (
        <Message>
          <h3>Order has already been "Cancelled" or "Delivered"</h3>
          {window.scrollTo(500, 0)}
          {destroyMessage()}
        </Message>
      )}

      {statusPopup && (
        <Popup title="Change status of the order">
          {showMessageInPopup && <h4>Please a select a value to update</h4>}
          <StyledSelect
            value={statusValue}
            onChange={(event) => setStatusValue(event.target.value)}
          >
            <option value="select">select</option>
            {status.map((item, index) => {
              if (currentStatusIndex < index) {
                return <option value={item}>{item}</option>;
              }
            })}
          </StyledSelect>
          <ButtonsContainer>
            <StatusButton
              onClick={() => {
                if (statusValue === "select") {
                  return setShowMessageInPopup(true);
                }
                setShowMessageInPopup(false);
                performStatusChange(statusValue);
              }}
            >
              Change
            </StatusButton>
            <CloseStatusPopup onClick={() => setStatusPopup(false)}>
              Close
            </CloseStatusPopup>
          </ButtonsContainer>
        </Popup>
      )}
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
              <h3>Ship to</h3>
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
          <StatusButton
            onClick={() => {
              if (
                order.status === "Cancelled" ||
                order.status === "Delivered"
              ) {
                return setorderCompleted(true);
              }
              setStatusPopup(true);
            }}
          >
            Change status
          </StatusButton>
          <CancelButton
            onClick={() => {
              if (
                order.status === "Cancelled" ||
                order.status === "Delivered"
              ) {
                return setorderCompleted(true);
              }
              setShowMessage({
                isProcessing: true,
                error: false,
                success: false,
              });
              performStatusChange("Cancelled");
            }}
          >
            Cancel order
          </CancelButton>
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

const StatusButton = styled.button`
  background: #6ec72d;
  color: white;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1faa59;
  }
`;

const CancelButton = styled.button`
  background: #d82e2f;
  color: white;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  margin-left: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #b4161b;
  }
`;

const CloseStatusPopup = styled.button`
  background: #d82e2f;
  color: white;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  margin-left: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #b4161b;
  }
`;

const StyledSelect = styled.select`
  margin-left: 3rem;
  margin-bottom: 1rem;
  width: 10rem;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 1rem;
`;

const ButtonsContainer = styled.div`
  margin-left: 2rem;
`;

const Message = styled.div`
  display: block;
  background: #edbf69;
  padding: 0.2rem 0rem;
  text-align: center;

  width: 50%;
  margin: auto;
  margin-bottom: 0.5rem;
`;

export default UpdateOrder;

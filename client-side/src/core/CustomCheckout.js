import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

//cart helper
import { loadCart, emptyCart } from "./helper/cartHelper";

//api call
import { paymentIntent } from "./helper/paymentIntent";

//order helper
import { placeOrder } from "./helper/orderHelper";

//authentication
import { isAuthenticated } from "../auth/helper/index";

//components
import Popup from "./Popup";

const CustomCheckout = ({
  history,
  proceedToPay,
  setProceedToPay = (f) => f,
}) => {
  //stripe
  const stripe = useStripe();
  const elements = useElements();

  //user data
  const { user, token } = isAuthenticated();
  //state name variable
  const statesName = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Lakshadweep",
    "Puducherry",
  ];

  //states
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
    formData: new FormData(),
  });

  const [submittedBillingInfo, setSubmittedBillingInfo] = useState(false);

  const {
    name,
    email,
    phone,
    addressLine1,
    addressLine2,
    pincode,
    city,
    state,
    formData,
  } = shippingInfo;

  const [fieldEmpty, setFieldEmpty] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentState, setPaymentState] = useState({
    error: false,
    success: false,
    processing: false,
  });
  const [countDown, setCountDown] = useState(3);
  const [cardTypeError, setCardTypeError] = useState(false);

  const { error, success, processing } = paymentState;

  //use effect
  useEffect(() => {
    setCartItems(loadCart());
  }, []);

  //event handler
  const addressHandler = (name) => (event) => {
    const value = event.target.value;
    formData.set(name, value);
    setShippingInfo({ ...shippingInfo, [name]: value });
    setFieldEmpty(false);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (
      state === "" ||
      name === "" ||
      email === "" ||
      phone === "" ||
      pincode === "" ||
      city === "" ||
      addressLine1 === ""
    ) {
      return setFieldEmpty(true);
    }
    const completeAddress =
      addressLine1 +
      ", " +
      addressLine2 +
      ", " +
      city +
      ", " +
      pincode +
      ", " +
      state;

    setShippingInfo({
      ...shippingInfo,
      address: completeAddress,
    });
    setSubmittedBillingInfo(true);

    const data = {
      cartItems,
      description: "payment intent for an order",
      shippingAddress: {
        name,
        phone,
        address: {
          line1: completeAddress,
        },
      },
      receiptEmail: email,
    };

    const { clientSecret } = await paymentIntent(data);
    setClientSecret(clientSecret);
  };

  const cardChangeHandler = (event) => {
    const { error } = event;
    if (error) {
      setCardTypeError(true);
    } else {
      setCardTypeError(false);
    }
  };

  const handleCheckout = async () => {
    setPaymentState({
      ...paymentState,
      error: false,
      success: false,
      processing: true,
    });
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    });

    if (payload.error) {
      setPaymentState({
        ...paymentState,
        error: true,
        success: false,
        processing: false,
      });
    } else {
      emptyCart();
      const orderData = {
        products: cartItems,
        transaction_id: payload.paymentIntent.id,
        amount: payload.paymentIntent.amount / 100,
        address: {
          address_line: addressLine1 + ", " + addressLine2,
          buyer: name,
          phone,
          email,
          city,
          state,
          pincode,
          country: "India",
        },
      };
      await placeOrder(user._id, token, orderData);
      setPaymentState({
        ...paymentState,
        error: false,
        success: true,
        processing: false,
      });
    }
  };

  //templates
  const getAddressTemplate = () => {
    return (
      <form onSubmit={submitHandler} className="billing-form">
        <h3>Contact information : </h3>
        <input
          type="text"
          value={name}
          onChange={addressHandler("name")}
          placeholder="Enter your name here"
        />
        <input
          type="email"
          value={email}
          onChange={addressHandler("email")}
          placeholder="Enter your email"
        />
        <input
          type="tel"
          value={phone}
          onChange={addressHandler("phone")}
          placeholder="Enter your phone number"
        />
        <h3>Address : </h3>
        <input
          type="text"
          value={addressLine1}
          onChange={addressHandler("addressLine1")}
          placeholder="Address line 1"
          maxLength="40"
        />
        <input
          type="text"
          value={addressLine2}
          onChange={addressHandler("addressLine2")}
          placeholder="Address line 2(optional)"
          maxLength="50"
        />
        <input
          type="text"
          value={city}
          onChange={addressHandler("city")}
          placeholder="City"
        />
        <input
          type="text"
          value={pincode}
          onChange={addressHandler("pincode")}
          placeholder="Pincode"
        />
        <select onChange={addressHandler("state")}>
          <option value="">Select state</option>
          {statesName.map((state) => {
            return <option value={state}>{state}</option>;
          })}
        </select>

        <SubmitButton>Proceed</SubmitButton>
      </form>
    );
  };

  //styles
  const cardStyle = {
    style: {
      base: {
        color: "#000",
        fontFamily: "Roboto, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#606060",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const getPaymentDetailTemplate = () => {
    return (
      <>
        <h3>Enter Payment Details</h3>
        <div className="stripe-card">
          <CardNumberElement
            options={cardStyle}
            onChange={cardChangeHandler}
            className="card-element"
          />
        </div>
        <div className="stripe-card">
          <CardExpiryElement
            options={cardStyle}
            onChange={cardChangeHandler}
            className="card-element"
          />
        </div>
        <div className="stripe-card">
          <CardCvcElement
            options={cardStyle}
            onChange={cardChangeHandler}
            className="card-element"
          />
        </div>
        <div className="submit-btn">
          <button onClick={() => handleCheckout()}>Pay</button>
        </div>
      </>
    );
  };

  const getPaymentStatusMessage = () => {
    if (error) {
      return (
        <Popup title="Payment failed">
          <h3>Please check your card details or try again later.</h3>
          <ExitButton
            onClick={() =>
              setPaymentState({
                ...paymentState,
                error: false,
                success: false,
                processing: false,
              })
            }
          >
            Exit
          </ExitButton>
        </Popup>
      );
    } else if (success) {
      return (
        <Popup title="Payment successful">
          <h3>Payment successful. Redirecting in...{countDown} </h3>
          {getRedirect()}
        </Popup>
      );
    } else if (processing) {
      return (
        <Popup title="Processing payment">
          <h3>Processing payment please wait.</h3>
        </Popup>
      );
    }
  };

  const getRedirect = () => {
    setTimeout(() => {
      history.push("/");
    }, 3000);
    setInterval(() => {
      setCountDown(countDown - 1);
      if (countDown === 0) {
        clearInterval();
      }
    }, 1000);
  };
  return proceedToPay ? (
    <BillInfo>
      {getPaymentStatusMessage()}
      {fieldEmpty && (
        <>
          {window.scrollTo(500, 0)}
          <Message>Please fill all the fields</Message>
        </>
      )}
      {!submittedBillingInfo && getAddressTemplate()}
      {submittedBillingInfo && (
        <>
          {cardTypeError && (
            <Message>Incorrect card detail. Please check.</Message>
          )}
          {getPaymentDetailTemplate()}
        </>
      )}
    </BillInfo>
  ) : (
    <Redirect to="/cart" />
  );
};

const BillInfo = styled.div`
  min-height: 80vh;
  .billing-form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 60%;
    margin: 2rem auto;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: gray;
    }

    input {
      width: 70%;
      margin: 1rem auto;
      font-size: 1.2rem;
      padding: 0.5rem;
      outline: none;
      transition: all 0.3s ease;
      border: 1px solid black;

      &:focus {
        border: 2px solid #2cb62c;
      }
    }

    select {
      width: 70%;
      margin: 1rem auto;
      border-radius: 5px;
      font-size: 1.2rem;
      padding: 0.5rem;
      outline: none;
    }

    h3 {
      margin-left: 15%;
    }

    @media screen and (max-width: 501px) {
      input {
        width: 90%;
      }
      select {
        width: 90%;
      }
      h3 {
        margin-left: 5%;
      }
    }
  }

  .card-element {
    width: 20rem;
    margin: auto;
    margin-bottom: 1rem;
    border: 1px solid black;
    padding: 1rem;
  }

  .submit-btn {
    button {
      margin-top: 2rem;
      background: black;
      color: white;
      padding: 1rem;
      border: none;
      width: 10rem;
      font-size: 1rem;
    }
  }
`;

const SubmitButton = styled.button`
  width: 70%;
  padding: 0.7rem;
  font-size: 1rem;
  color: white;
  background: black;
  border: none;
  margin: auto;
`;

const Message = styled.h3`
  margin: 2rem 0rem;
  background: #e8bd0d;
  color: white;
  display: inline-block;
  padding: 2rem 2rem;
`;

const ExitButton = styled.button`
  border: none;
  background: black;
  color: white;
  padding: 0.5rem 1rem;
  margin-left: 40%;
  font-size: 1rem;
`;

export default CustomCheckout;

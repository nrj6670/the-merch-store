import React, { useState } from "react";
import styled from "styled-components";
import { Redirect, withRouter } from "react-router-dom";

//api calls
import { signup } from "../auth/helper/index";

//components
import Popup from "../core/Popup";
import Loading from "../styles/Loading";

const Signup = ({ history }) => {
  //states
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [stage, setStage] = useState({
    error: false,
    success: false,
    loading: false,
    statusCode: "",
  });
  const [countDown, setCountDown] = useState(3);

  const { name, email, phone, password } = values;
  const { error, success, loading, statusCode } = stage;

  //event handler
  const handleValueChange = (value) => (event) => {
    setValues({ ...values, [value]: event.target.value });
  };

  const closePopup = () => {
    setStage({ ...stage, error: false });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setStage({ ...stage, error: false, success: false, loading: true });

    const { status } = await signup(values);
    if (status === 409 || status === 400) {
      return setStage({
        ...stage,
        error: true,
        success: false,
        loading: false,
        statusCode: status,
      });
    }
    setValues({ name: "", email: "", phone: "", password: "" });
    return setStage({ ...stage, error: false, success: true, loading: false });
  };

  const getRedirect = () => {
    setTimeout(() => {
      history.push("/signin");
    }, 3000);
    setInterval(() => {
      setCountDown(countDown - 1);
      if (countDown === 0) {
        clearInterval();
      }
    }, 1000);
  };

  return (
    <StyledSignUp>
      {loading && (
        <Popup title="Loading">
          <Loading />
          <h3>Please wait while we are trying to register you in</h3>
        </Popup>
      )}
      {error && (
        <Popup title="Signup failed">
          {statusCode === 409 && (
            <h3>
              Email/phone number with which you are trying to signup already
              exists
            </h3>
          )}
          {statusCode === 400 && (
            <h3>
              Cannot process your request at the moment please try again later
            </h3>
          )}
          <CloseButton onClick={closePopup}>Close</CloseButton>
        </Popup>
      )}
      {success && (
        <Popup title="Signup successful">
          <Loading />
          <h3>
            Signup successful. Redirecting to sign in page in... {countDown}
          </h3>
          {getRedirect()}
        </Popup>
      )}
      <form onSubmit={submitHandler}>
        <label htmlFor="name">Name : </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleValueChange("name")}
          required
        />
        <label htmlFor="email">Email : </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleValueChange("email")}
          required
        />
        <label htmlFor="phone">Phone number : </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={phone}
          onChange={handleValueChange("phone")}
          required
        />
        <label htmlFor="password">Password : </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleValueChange("password")}
          required
        />
        <button type="submit">Register</button>
      </form>
    </StyledSignUp>
  );
};

const StyledSignUp = styled.div`
  width: 90%;
  margin: auto;
  min-height: 90vh;
  padding: 2rem;

  @media screen and (max-width: 406px) {
    padding: 1rem 0rem;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    input {
      padding: 0.8rem;
      font-size: 1rem;
      width: 40%;
      border: 2px solid black;
      border-radius: 10px;
      transition: 0.5s;
      outline: none;
      &:focus {
        border: 2px solid #1eda1e;
      }
    }

    button {
      margin-top: 2rem;
      padding: 1rem 2rem;
      font-size: 1.2rem;
      font-weight: 400;
      border: none;
      background-image: linear-gradient(
        to right,
        #84fab0 0%,
        #8fd3f4 51%,
        #84fab0 100%
      );
      color: white;
      border-radius: 10px;
    }

    @media screen and (max-width: 1060px) {
      input {
        width: 70%;
      }
    }
  }
`;

const CloseButton = styled.button`
  margin-left: 45%;
  font-size: 1rem;
  background-color: #f04949;
  padding: 0.5px 1rem;
  color: white;
  border: none;
  cursor: pointer;
`;

export default withRouter(Signup);

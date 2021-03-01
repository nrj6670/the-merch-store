import React, { useState } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";

//api calls
import { signin, authenticate, isAuthenticated } from "../auth/helper/index";

//components
import Popup from "../core/Popup";
import Loading from "../styles/Loading";

const Signin = () => {
  //states
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  //userAuthentication
  const { user } = isAuthenticated();

  const [stage, setStage] = useState({
    error: false,
    success: false,
    loading: false,
  });

  const { email, password } = values;
  const { error, success, loading } = stage;

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

    const response = await signin(values);

    if (response.status === 401 || response.status === 400) {
      return setStage({
        ...stage,
        error: true,
        success: false,
        loading: false,
      });
    }
    setValues({ email: "", password: "" });

    //authenticate user
    await authenticate(response);

    return setStage({ ...stage, error: false, success: true, loading: false });
  };

  return (
    <StyledSignIn>
      {loading && (
        <Popup title="Loading">
          <Loading />
          <h3>Please wait while we are trying to sign you in</h3>
        </Popup>
      )}
      {error && (
        <Popup title="Signin failed">
          <h3>Email/password is wrong</h3>
          <CloseButton onClick={closePopup}>Close</CloseButton>
        </Popup>
      )}
      {success && (
        <Popup title="Signin successful">
          <Loading />
          <h3>Please wait while we are redirecting you to home page</h3>
          {user.role === 0 ? (
            <Redirect to="/"></Redirect>
          ) : (
            <Redirect to="/admin/dashboard"></Redirect>
          )}
        </Popup>
      )}
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email : </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleValueChange("email")}
          required
          autoComplete="off"
        />
        <label htmlFor="password">Password : </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handleValueChange("password")}
          required
          autoComplete="off"
        />
        <button type="submit">Sign in</button>
      </form>
    </StyledSignIn>
  );
};

const StyledSignIn = styled.div`
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

export default Signin;

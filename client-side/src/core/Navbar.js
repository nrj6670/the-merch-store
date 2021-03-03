import React, { Fragment } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

//authentication check api call
import { isAuthenticated, signout } from "../auth/helper/index";

const Navbar = ({ history }) => {
  //check for user authentication and fetching user data;
  const { user } = isAuthenticated();

  return (
    <Nav>
      <NavContainer>
        <Icon>
          <h2>The Merch Store</h2>
        </Icon>
        <NavLinks>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated() &&
              (user.role === 1 ? (
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
              ) : (
                <li>
                  <Link to="/user/dashboard">Dashboard</Link>
                </li>
              ))}
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            {!isAuthenticated() && (
              <Fragment>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
                <li>
                  <Link to="/signin">Signin</Link>
                </li>
              </Fragment>
            )}
            {isAuthenticated() && (
              <li>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    signout();
                    history.push("/");
                  }}
                >
                  Logout
                </span>
              </li>
            )}
          </ul>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

const Nav = styled.div`
  min-height: 10vh;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.5);
  padding: 2rem 0rem;
`;

const NavContainer = styled.div`
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Icon = styled.div`
  flex: 1 1 20rem;
  h2 {
    text-align: start;
    font-family: "Lobster", sans-serif;
  }

  @media screen and (max-width: 1066px) {
    h2 {
      text-align: center;
    }
  }
`;

const NavLinks = styled.ul`
  flex: 2 1 40rem;
  font-size: 1.3rem;
  ul {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;

    li {
      flex: 1 1 5rem;
    }
  }

  @media screen and (max-width: 1066px) {
    ul {
      margin-top: 2rem;
    }
  }

  @media screen and (max-width: 227px) {
    li:last-child {
      padding-top: 1rem;
    }
  }
`;

export default withRouter(Navbar);

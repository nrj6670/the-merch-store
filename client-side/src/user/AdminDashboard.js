import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//api calls
import { isAuthenticated } from "../auth/helper/index";

const AdminDashboard = () => {
  //user data
  const { user } = isAuthenticated();

  return (
    <StyledDashBoard>
      <AdminPanel>
        <ul>
          <li>
            <Link to="/admin/orders">Manage order</Link>
          </li>
          <li>
            <Link to="/admin/categories">Manage category</Link>
          </li>
          <li>
            <Link to="/admin/products">Manage product</Link>
          </li>
          <li>
            <Link to="/admin/create/product">Create product</Link>
          </li>
        </ul>
      </AdminPanel>

      <InfoPanel>
        <div>
          <span>Name : </span>
          <span>{user.name}</span>
        </div>

        <div>
          <span>Email : </span>
          <span>{user.email}</span>
        </div>

        <div>
          <span>Phone number : </span>
          <span>{user.phone}</span>
        </div>
      </InfoPanel>
    </StyledDashBoard>
  );
};

const StyledDashBoard = styled.div`
  width: 90%;
  margin: auto;
  margin-top: 2rem;
  min-height: 80vh;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 406px) {
    padding: 1rem 1rem;
  }
`;

const AdminPanel = styled.div`
  flex: 1 1 10rem;
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  padding: 2rem 0.3rem;
  border: 2px solid black;

  li {
    padding: 1rem 0.5rem;
    transition: all 0.3s ease;
  }

  li:hover {
    background: rgba(27, 152, 245);
    a {
      color: white;
    }
  }
`;
const InfoPanel = styled.div`
  font-size: 1.2rem;
  padding: 2rem 0rem;
  flex: 2 1 45rem;
  margin-top: 2rem;
  border: 2px solid black;
  margin-left: 2rem;

  div {
    padding: 0.5rem 0rem;
  }

  @media screen and (max-width: 996px) {
    margin-left: 0rem;
  }
`;

export default AdminDashboard;

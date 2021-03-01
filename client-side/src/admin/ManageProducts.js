import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

//action
import { fetchProducts } from "../actions/productsAction";

//api calls
import { deleteProduct } from "./helper/adminApiCalls";

//authorization
import { isAuthenticated } from "../auth/helper/index";

const ManageProducts = () => {
  //initializing dispatch
  const dispatch = useDispatch();

  //authorized user data
  const { user, token } = isAuthenticated();

  //state

  const [reload, setReload] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [reload]);

  const { products, isLoading } = useSelector((state) => state.products);
  const totalProducts = isLoading ? 0 : products.length;

  //event handler
  const deleteProductHandler = (productId) => {
    deleteProduct(productId, user._id, token)
      .then((response) => {
        setReload(!reload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ProductsContainer>
      <h2>Total {totalProducts} found : </h2>
      {!isLoading && products.length !== 0 ? (
        products.map((product, index) => {
          return (
            <ProductList key={index}>
              <li>{`${index + 1}. ${product.name}`}</li>
              <li>
                <Link to={`/admin/product/${product._id}`}>Update product</Link>
              </li>
              <li>
                <span onClick={() => deleteProductHandler(product._id)}>
                  Delete product
                </span>
              </li>
            </ProductList>
          );
        })
      ) : (
        <h2>No product to show</h2>
      )}
    </ProductsContainer>
  );
};

const ProductsContainer = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  margin-top: 2rem;
  padding: 2rem;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 406px) {
    padding: 1rem 1rem;
  }

  h2 {
    margin-bottom: 2rem;
  }
`;

const ProductList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  margin-top: 1rem;
  border: 2px solid black;
  padding: 2rem;
  transition: all 0.5s ease;

  li:nth-child(1) {
    flex: 3 1 20rem;
  }

  li:nth-child(2) {
    flex: 1 1 10rem;
  }

  li:nth-child(3) {
    flex: 1 1 10rem;
    span {
      cursor: pointer;
    }
  }

  a {
    background-color: #03203c;
    color: white;
    padding: 0.3rem 0.4rem;
  }

  span {
    background-color: #242b2e;
    color: white;
    padding: 0.3rem 0.4rem;
  }

  @media screen and (max-width: 502px) {
    li:nth-child(2) {
      margin-top: 2rem;
    }
  }

  @media screen and (max-width: 680px) {
    li:nth-child(2) {
      margin-top: 2rem;
    }
    li:nth-child(3) {
      margin-top: 2rem;
    }
  }

  @media screen and (min-width: 680px) and (max-width: 858px) {
    li:nth-child(3) {
      margin-top: 2rem;
    }
  }

  &:hover {
    background: rgb(117, 130, 131, 0.5);
  }
`;

export default ManageProducts;

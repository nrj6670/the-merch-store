import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

//components
import Card from "./Card";

//action
import { fetchProducts } from "../actions/productsAction";

const Home = () => {
  //dispatch
  const dispatch = useDispatch();

  //state
  const [openPopup, setOpenPopup] = useState(false);

  //use effect
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  //extraction store data
  const { products, isLoading } = useSelector((state) => state.products);

  return (
    <StyledHome>
      {Object.keys(products).length !== 0 && (
        <CardContainer>
          {products.map((product) => (
            <Card
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
              key={product._id}
              product={product}
            />
          ))}
        </CardContainer>
      )}
    </StyledHome>
  );
};

const StyledHome = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  padding: 2rem;

  @media screen and (max-width: 406px) {
    padding: 1rem 0rem;
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;

  @media screen and (max-width: 406px) {
    grid-column-gap: 0.2rem;
    grid-row-gap: 1rem;
  }
`;

export default Home;

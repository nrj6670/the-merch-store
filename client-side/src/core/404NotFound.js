import React from "react";
import styled from "styled-components";

const NotFound = () => {
  return (
    <StyledPage>
      <h2>404 Page not found</h2>
    </StyledPage>
  );
};

const StyledPage = styled.div`
  width: 90%;
  margin: auto;
  min-height: 80vh;
  padding: 2rem;

  @media screen and (max-width: 406px) {
    padding: 1rem 0rem;
  }
`;

export default NotFound;
